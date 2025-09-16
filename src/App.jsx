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
import CustomNode from "./components/CustomNode";

const initialNodes = [
  {
    id: "play-1",
    position: { x: 50, y: 50 },
    type: "custom",
    data: { label: "Play 1", type: "play", prompt: "Hello", br: false },
  },
  {
    id: "play-2",
    position: { x: 50, y: 200 },
    type: "custom",
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
      type: "custom",
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
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
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

  // delete a node by id (used by per-node delete buttons)
  const handleDeleteNode = useCallback(
    (id) => {
      setNodes((nds) => {
        undoStack.current.push({ nodes: nds, edges });
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        redoStack.current = [];
        return nds.filter((n) => n.id !== id);
      });
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      // clear selection if it was the deleted node
      setSelectedNode((sn) => (sn && sn.id === id ? null : sn));
    },
    [edges]
  );

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar onAddPlay={addPlayNode} />
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#0fb1b3" }}
              >
                <polyline points="15 3 9 9 15 15" />
                <path d="M21 10v6a2 2 0 0 1-2 2H8" />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#0fb1b3" }}
              >
                <polyline points="9 3 15 9 9 15" />
                <path d="M3 10v6a2 2 0 0 0 2 2h11" />
              </svg>
            </button>
            
          </div>

          <ReactFlow
            nodes={nodes.map((n) => ({ ...n, data: { ...(n.data || {}), onDelete: handleDeleteNode } }))}
            edges={edges}
            colorMode="light"
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={{ custom: CustomNode }}
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
