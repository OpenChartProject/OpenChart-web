import React from "react";
import { discord, github } from "../assets";

export const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <div className="toolbar">
                <a title="New chart">
                    <span className="material-icons">add</span>
                </a>
                <a title="Save chart">
                    <span className="material-icons">save_alt</span>
                </a>
                <div className="divider"></div>
                <a title="Zoom in">
                    <span className="material-icons">zoom_in</span>
                </a>
                <a title="Zoom out">
                    <span className="material-icons">zoom_out</span>
                </a>
            </div >
            <div className="footer">
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
        </div >
    );
};
