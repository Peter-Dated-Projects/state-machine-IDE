import React, { useEffect, useRef } from "react";
import styles from "./styles/contextmenu.module.css";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onColorSelect: (color: string) => void;
}

const COLORS = [
  "#FF6B6B", // Red
  "#E67E22", // Orange
  "#FFEEAD", // Yellow
  "#96CEB4", // Green
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#000080", // Navy
  "#D4A5A5", // Pink
  "#9B59B6", // Purple
  "#333333", // Gray
];

export const NodeContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
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

  // Ensure the menu stays within viewport bounds
  // const menuWidth = 200;
  // const menuHeight = 150;
  // const viewportWidth = window.innerWidth;
  // const viewportHeight = window.innerHeight;

  // // adjust x coords
  // let adjustedX = x;
  // if (x + menuWidth > viewportWidth) {
  //   adjustedX = x - menuWidth;
  // }

  // // adjust y coords
  // let adjustedY = y;
  // if (y + menuHeight > viewportHeight) {
  //   adjustedY = y - menuHeight;
  // }

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
