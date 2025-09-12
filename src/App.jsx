import { useState, useCallback } from "react";
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

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => {
        const next = applyNodeChanges(changes, nds);
        setSelectedNode((sn) => {
          if (!sn) return sn;
          const found = next.find((n) => n.id === sn.id);
          return found || null;
        });
        return next;
      }),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addPlayNode = useCallback(() => {
    const id = `play-${Date.now()}`;
    const newNode = {
      id,
      position: { x: 100, y: 100 },
      data: { label: "Play", type: "play", prompt: "", br: false },
    };
    setNodes((nds) => nds.concat(newNode));
    setSelectedNode(newNode);
  }, []);

  const updateNodeData = useCallback((id, data) => {
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data } : n)));
    setSelectedNode((sn) => (sn && sn.id === id ? { ...sn, data } : sn));
  }, []);

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar onAddPlay={addPlayNode} />
      <div style={{ flex: 1, height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          colorMode="light"
          onNodeClick={(_, node) => setSelectedNode(node)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ width: "100%", height: "100%", background: "#ffffff" }}
        >
          <Controls />
        </ReactFlow>
      </div>
      <RightSidebar
        selectedNode={selectedNode}
        updateNodeData={updateNodeData}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
