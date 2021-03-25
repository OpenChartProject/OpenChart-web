import React from "react";
import { discord, github } from "../assets";

export const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <div className="sidebar-content"></div>
            <div className="sidebar-footer">
                <a
                    href="https://discord.gg/wSGmN52"
                    title="Visit us on Discord"
                    target="_blank"
                >
                    <img src={discord} />
                </a>

                <a
                    href="https://github.com/OpenChartProject/OpenChart-web"
                    title="View OpenChart on GitHub"
                    target="_blank"
                >
                    <img src={github} />
                </a>
            </div>
        </div>
    );
};
