import React from "react";
import styles from "./styles/tabcard.module.css";

interface TabCardProps {
  title: string;
  activeTab: number;
  tabKey: number;
  onClick: () => void;
}

export default function TabCard({
  title,
  activeTab,
  tabKey,
  onClick,
}: TabCardProps) {
  return (
    <div
      className={`${styles["container"]} ${
        activeTab == tabKey
          ? styles["active-container"]
          : styles["inactive-container"]
      }`}
      onClick={onClick}
    >
      <div className={styles["tab-card-title"]}>{title}</div>
    </div>
  );
}
