import React from "react";
import { github } from "../assets";

export const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <div className="sidebar-content"></div>
            <div className="sidebar-footer">
                <a
                    href="https://github.com/OpenChartProject/OpenChart-web"
                    target="_blank"
                >
                    <img src={github} />
                </a>
            </div>
        </div>
    );
};
