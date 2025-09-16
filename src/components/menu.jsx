import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MenuNode from "./menunode"; // custom menu node (file is menunode.jsx)
import "./menu.css";

// initial ek node
const initialNodes = [
  {
    id: "1",
    type: "menu",
    data: { label: "Main Menu", promptText: "Welcome to IVR" },
    position: { x: 100, y: 100 },
  },
];

const nodeTypes = {
  menu: MenuNode,
};

function Menu() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Node / Edge handlers
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  // Node select
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Add new menu node
  const addMenuNode = () => {
    const newNodeId = (nodes.length + 1).toString();
    const newMenuNode = {
      id: newNodeId,
      type: "menu",
      data: { label: `Menu ${newNodeId}`, promptText: "New prompt..." },
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250 + 100,
      },
    };
    setNodes((nds) => nds.concat(newMenuNode));
    setSelectedNode(newMenuNode);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Left Controls Panel */}
      <div style={{ width: "200px", background: "#e0f7fa", padding: "10px" }}>
        <h3>Controls</h3>
        <button
          onClick={addMenuNode}
          style={{ padding: "10px", margin: "5px 0", width: "100%" }}
        >
          ➕ Add Menu
        </button>
      </div>

      {/* React Flow Canvas */}
      <div style={{ flexGrow: 1, height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Right Properties Panel */}
      <div style={{ width: "300px", background: "#f0f0f0", padding: "10px" }}>
        <h3>Properties</h3>
        {selectedNode ? (
          <div>
            <h4>{selectedNode.data.label}</h4>
            <p>ID: {selectedNode.id}</p>
            <p>Type: {selectedNode.type}</p>

            {selectedNode.type === "menu" && (
              <>
                <label>
                  Prompt Text:
                  <input
                    type="text"
                    value={selectedNode.data.promptText || ""}
                    onChange={(e) =>
                      setNodes((nds) =>
                        nds.map((n) =>
                          n.id === selectedNode.id
                            ? {
                                ...n,
                                data: {
                                  ...n.data,
                                  promptText: e.target.value,
                                },
                              }
                            : n
                        )
                      )
                    }
                    style={{ width: "100%", marginTop: "5px" }}
                  />
                </label>
              </>
            )}
          </div>
        ) : (
          <p>Select a node to view properties.</p>
        )}
      </div>
    </div>
  );
}

export default Menu;
