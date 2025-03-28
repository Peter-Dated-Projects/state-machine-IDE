import React, { useEffect, useRef } from "react";
import styles from "./styles/contextmenu.module.css";
import { AppNode } from "./types";

interface ContextMenuProps {
  x: number;
  y: number;
  node: AppNode;
  onClose: () => void;
  onColorSelect: (color: string) => void;
}

const COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEEAD", // Yellow
  "#D4A5A5", // Pink
  "#9B59B6", // Purple
  "#E67E22", // Orange
];

export const NodeContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  node,
  onClose,
  onColorSelect,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  function onDelete() {
    throw new Error("Function not implemented.");
  }

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 1000,
      }}
    >
      <div className={styles.headerContainer}>
        <div className={styles.header}>{node.data.label}</div>
        <button
          className={styles.deleteNodeButton}
          onClick={() => {
            onDelete();
            // make delete function off node.data.props.nodeInformation.activeNodes.getter
          }}
        >
          Delete Node
        </button>
      </div>
      <div className={styles.colorGrid}>
        {COLORS.map((color) => (
          <button
            key={color}
            className={styles.colorButton}
            style={{ backgroundColor: color }}
            onClick={() => {
              onColorSelect(color);
              onClose();
            }}
          />
        ))}
      </div>
    </div>
  );
};
