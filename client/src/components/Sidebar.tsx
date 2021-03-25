import React from "react";
import { discord, github } from "../assets";

export const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <div className="sidebar-content">
                <a href="#" title="New chart">
                    <span className="material-icons">add</span>
                </a>
                <a href="#" title="Save chart">
                    <span className="material-icons">save_alt</span>
                </a>
            </div>
            <div className="sidebar-footer">
                <a
                    href="https://github.com/OpenChartProject/OpenChart-web/issues/new"
                    title="Report a bug or issue"
                    target="_blank"
                >
                    <span className="material-icons">report</span>
                </a>

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
