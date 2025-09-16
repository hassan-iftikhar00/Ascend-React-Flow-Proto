import React from "react";
import "./customNode.css";

export default function CustomNode({ id, data }) {
  const handleDelete = (e) => {
    e.stopPropagation(); // prevent selecting the node when clicking delete
    if (data?.onDelete) data.onDelete(id);
  };

  return (
    // include react-flow__node so default flow styles apply
    <div className="custom-node react-flow__node">
      <div className="custom-node-content">{data?.label}</div>

      <button
        className="node-delete"
        title="Delete"
        aria-label="Delete"
        onClick={handleDelete}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
