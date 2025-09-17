import { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import MenuNode from "./components/menunode";
import { RotateCcw, RotateCw, Trash2 } from "lucide-react";

const initialNodes = [
  {
    id: "play-1",
    position: { x: 50, y: 50 },
    data: { label: "Play 1", type: "play", prompt: "Hello", br: false },
  },
  {
    id: "play-2",
    position: { x: 50, y: 200 },
    data: { label: "Play 2", type: "play", prompt: "Welcome", br: true },
  },
];
const initialEdges = [
  { id: "play-1-play-2", source: "play-1", target: "play-2" },
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  // refs to manage injected per-node delete buttons (we inject DOM into node elements)
  const nodeDeleteButtonsRef = useRef(new Map());

  // Undo / Redo history stacks
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const MAX_HISTORY = 50;

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => {
        const prev = nds;
        const next = applyNodeChanges(changes, nds);
        // push previous state into undo stack
        undoStack.current.push({ nodes: prev, edges });
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        // clear redo when new action occurs
        redoStack.current = [];
        setSelectedNode((sn) => {
          if (!sn) return sn;
          const found = next.find((n) => n.id === sn.id);
          return found || null;
        });
        return next;
      }),
    [edges]
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        const prev = eds;
        const next = applyEdgeChanges(changes, eds);
        undoStack.current.push({ nodes, edges: prev });
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        redoStack.current = [];
        return next;
      }),
    [nodes]
  );
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        const prev = eds;
        const next = addEdge(params, eds);
        undoStack.current.push({ nodes, edges: prev });
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        redoStack.current = [];
        return next;
      }),
    [nodes]
  );

  const addPlayNode = useCallback(() => {
    const id = `play-${Date.now()}`;
    const newNode = {
      id,
      position: { x: 100, y: 100 },
      data: { label: "Play", type: "play", prompt: "", br: false },
    };
    setNodes((nds) => {
      undoStack.current.push({ nodes: nds, edges });
      if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
      redoStack.current = [];
      return nds.concat(newNode);
    });
    setSelectedNode(newNode);
  }, []);

  const addMenuNode = useCallback(() => {
    console.log("addMenuNode called");
    const id = `menu-${Date.now()}`;
    const newNode = {
      id,
      position: { x: 150, y: 150 },
      data: { label: "Menu", type: "menu", promptText: "" },
    };
    setNodes((nds) => {
      undoStack.current.push({ nodes: nds, edges });
      if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
      redoStack.current = [];
      return nds.concat(newNode);
    });
    setSelectedNode(newNode);
  }, []);

  const updateNodeData = useCallback((id, data) => {
    setNodes((nds) => {
      undoStack.current.push({ nodes: nds, edges });
      if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
      redoStack.current = [];
      return nds.map((n) => (n.id === id ? { ...n, data } : n));
    });
    setSelectedNode((sn) => (sn && sn.id === id ? { ...sn, data } : sn));
  }, []);

  // selection handlers
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // delete selected node or edge
  const handleDeleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => {
        undoStack.current.push({ nodes: nds, edges });
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        redoStack.current = [];
        return nds.filter((n) => n.id !== selectedNode.id);
      });
      // also remove any edges connected to the deleted node
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
      return;
    }
    if (selectedEdge) {
      setEdges((eds) => {
        undoStack.current.push({ nodes, edges: eds });
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        redoStack.current = [];
        return eds.filter((e) => e.id !== selectedEdge.id);
      });
      setSelectedEdge(null);
      return;
    }
  }, [selectedNode, selectedEdge, nodes, edges]);

  const handleUndo = useCallback(() => {
    const entry = undoStack.current.pop();
    if (!entry) return;
    // push current to redo
    redoStack.current.push({ nodes, edges });
    setNodes(entry.nodes);
    setEdges(entry.edges);
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [nodes, edges]);

  const handleRedo = useCallback(() => {
    const entry = redoStack.current.pop();
    if (!entry) return;
    undoStack.current.push({ nodes, edges });
    setNodes(entry.nodes);
    setEdges(entry.edges);
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [nodes, edges]);

  // delete a node by id (used by floating per-node delete button)
  const handleDeleteNode = useCallback(
    (id) => {
      setNodes((nds) => {
        undoStack.current.push({ nodes: nds, edges });
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        redoStack.current = [];
        return nds.filter((n) => n.id !== id);
      });
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedNode((sn) => (sn && sn.id === id ? null : sn));
    },
    [edges]
  );

  const onNodeMouseEnter = useCallback(
    (event, node) => {
      const nodeEl = event.currentTarget;
      // don't inject twice
      if (nodeDeleteButtonsRef.current.has(node.id)) return;

      // create button element
      const btn = document.createElement("button");
      btn.setAttribute("title", "Delete");
      btn.setAttribute("aria-label", "Delete node");
      btn.style.position = "absolute";
      btn.style.top = "4px";
      btn.style.right = "4px";
      btn.style.zIndex = "10";
      btn.style.background = "#e53935";
      btn.style.border = "none";
      btn.style.padding = "0px";
      btn.style.cursor = "pointer";
      btn.style.paddingLeftLeft = "4px";
      btn.style.color = "#ffffff";
      btn.style.display = "inline-flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.width = "14px";
      btn.style.height = "14px";
      btn.style.borderRadius = "50%";
      // Add these two lines to fix centering:
      btn.style.transform = "translate(0, 0)";
      btn.style.overflow = "hidden";

      // Better yet, use a centered SVG approach:
      btn.innerHTML = `
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display: block; margin: auto;">
    <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

      const onClick = (e) => {
        e.stopPropagation();
        handleDeleteNode(node.id);
      };
      btn.addEventListener("click", onClick);

      nodeDeleteButtonsRef.current.set(node.id, { btn, onClick });

      nodeEl.style.position = nodeEl.style.position || "absolute";
      nodeEl.appendChild(btn);
    },
    [handleDeleteNode]
  );

  const onNodeMouseLeave = useCallback((event, node) => {
    const entry = nodeDeleteButtonsRef.current.get(node.id);
    if (!entry) return;
    const { btn, onClick } = entry;
    try {
      btn.removeEventListener("click", onClick);
      if (btn.parentNode) btn.parentNode.removeChild(btn);
    } catch {
      // ignore
    }
    nodeDeleteButtonsRef.current.delete(node.id);
  }, []);

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar onAddPlay={addPlayNode} onAddMenu={addMenuNode} />
      <div style={{ flex: 1, height: "100vh" }}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 12,
              zIndex: 10,
              display: "flex",
              gap: 8,
            }}
          >
            <button
              onClick={handleUndo}
              title="Undo"
              aria-label="Undo"
              style={{
                background: "transparent",
                border: "none",
                padding: 6,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RotateCcw color="#0fb1b3" size={18} />
            </button>
            <button
              onClick={handleRedo}
              title="Redo"
              aria-label="Redo"
              style={{
                background: "transparent",
                border: "none",
                padding: 6,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RotateCw color="#0fb1b3" size={18} />
            </button>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            colorMode="light"
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={{ menu: MenuNode }}
            fitView
            style={{ width: "100%", height: "100%", background: "#ffffff" }}
          >
            <Controls />
          </ReactFlow>
        </div>
      </div>
      <RightSidebar
        selectedNode={selectedNode}
        updateNodeData={updateNodeData}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
