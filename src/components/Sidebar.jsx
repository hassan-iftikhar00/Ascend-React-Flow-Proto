import React from "react";
import "./sidebar.css";
import {
  Home,
  User,
  Keyboard,
  Phone,
  Clock,
  Mic,
  Cpu,
  Hash,
  Terminal,
  CheckCircle,
  FunctionSquare,
  Book,
  Percent,
  FileText,
  Volume2,
  Settings,
  Variable,
} from "lucide-react";

const items = [
  { key: "play", label: "Play", Icon: Home },
  { key: "menu", label: "Menu", Icon: User },
  { key: "input", label: "Input", Icon: Keyboard },
  { key: "record", label: "Record", Icon: Book },
  { key: "dtmf", label: "DTMF", Icon: Phone },
  { key: "ddtmf", label: "DDTMF", Icon: Phone },
  { key: "wait", label: "Wait", Icon: Clock },
  { key: "tts", label: "TTS", Icon: Mic },
  { key: "stt", label: "STT", Icon: Mic },
  { key: "istt", label: "iSTT", Icon: Mic },
  { key: "terminator", label: "Terminator", Icon: Terminal },
  { key: "confirmation", label: "Confirmation", Icon: CheckCircle },
  { key: "function", label: "Function", Icon: FunctionSquare },
  { key: "if", label: "If", Icon: Percent },
  { key: "variable", label: "Variable", Icon: Variable },
  { key: "language", label: "Language", Icon: FileText },
  { key: "set-value", label: "Set Value", Icon: FileText },
  { key: "audio", label: "Audio", Icon: Volume2 },
  { key: "transfer", label: "Transfer Call", Icon: Phone },
  { key: "settings", label: "Settings", Icon: Settings },
];

export default function Sidebar({ onAddPlay, onAddMenu }) {
  return (
    <aside className="rf-sidebar">
      <div className="rf-sidebar-header">Controls</div>
      <nav className="rf-sidebar-list">
        {items.map((it) => (
          <div
            className="rf-sidebar-item"
            key={it.key}
            onClick={() => {
              if (it.key === "play" && onAddPlay) onAddPlay();
              if (it.key === "menu" && onAddMenu) onAddMenu();
            }}
          >
            <it.Icon className="rf-icon" />
            <span className="rf-label">{it.label}</span>
          </div>
        ))}
      </nav>

      {/* Right-hand properties panel was moved to RightSidebar.jsx */}
    </aside>
  );
}
