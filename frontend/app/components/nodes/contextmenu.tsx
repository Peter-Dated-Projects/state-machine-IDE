import React, { useEffect, useRef } from "react";
import styles from "./styles/contextmenu.module.css";
import { AppNode } from "./types";

interface ContextMenuProps {
  x: number;
  y: number;
  node: AppNode;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  onNodeDelete: () => void;
}

const COLORS = [
  "#FF6B6B", // Red
  "#E67E22", // Orange
  "#FFEEAD", // Yellow
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#D4A5A5", // Pink
  "#9B59B6", // Purple
];

export const NodeContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  node,
  onClose,
  onColorSelect,
  onNodeDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is on the canvas (react-flow__pane)
      const isCanvasClick =
        (event.target as HTMLElement).closest(".react-flow__pane") !== null;

      // If the click is on the canvas or outside the menu, close it
      if (
        isCanvasClick ||
        (menuRef.current && !menuRef.current.contains(event.target as Node))
      ) {
        onClose();
      }
    };

    // Add event listener after a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, menuRef]);

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{
        left: x,
        top: y,
        zIndex: 1000,
      }}
    >
      <div className={styles.headerContainer}>
        <div className={styles.header}>{node.data.label}</div>
        <button className={styles.deleteNodeButton} onClick={onNodeDelete}>
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
