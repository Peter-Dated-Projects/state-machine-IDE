"use client";

import BaseClassTab from "./baseclasstab";
import styles from "./styles/sidebar.module.css";
import TabCard from "./tabcard";
import React from "react";

interface SideBarProps {
    width: number;
}

// side bar object
const SideBar: React.FC<SideBarProps> = ({ width }) => {
    const [activeTab, setActiveTab] = React.useState(0);

    // tab data
    const TAB_DATA = ["Base Class", "Node Editor"];
    const TAB_DATA_OBJECTS = [
        <BaseClassTab key={0} width={width} />,
        <div key={1}>Node Editor</div>,
    ];

    return (
        <div className={styles.container}>
            <div className={styles["container-grid"]}>
                <div className={styles["container-grid-item"]}>
                    <div className={styles["tab-cards-container"]}>
                        {TAB_DATA.map((tab, index) => (
                            <div
                                key={index}
                                onClick={(e) => {
                                    setActiveTab(index);
                                    console.log("clicked", index);
                                }}
                            >
                                <TabCard key={index} title={tab} />
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className={styles["container-grid-item"]}
                    style={{ flex: 1 }}
                >
                    <div>{TAB_DATA_OBJECTS[activeTab]}</div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
