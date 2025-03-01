import React from "react";

import styles from "./styles/tabcard.module.css";

interface TabCardProps {
  title: string;
}

export default function TabCard({ title }: TabCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles["tab-card-header"]}>
        <div className={styles["tab-card-title"]}>{title}</div>
      </div>
    </div>
  );
}
