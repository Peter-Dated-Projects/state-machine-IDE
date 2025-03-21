import React from "react";
import styles from "./styles/contextmenu.module.css";

interface ContextMenuProps {
  x: number;
  y: number;
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
  onClose,
  onColorSelect,
}) => {
  return (
    <div
      className={styles.contextMenu}
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 1000,
      }}
    >
      <div className={styles.header}>Node Color</div>
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
