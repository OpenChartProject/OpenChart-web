import React from "react";
import { discord, github } from "../assets";
import { ZoomAction } from "../store/actions";
import { Store } from "../store/store";

export interface Props {
    store: Store;
}

export const Sidebar = (props: Props) => {
    const { store } = props;

    const zoomIn = () => {
        new ZoomAction(store, {
            to: store.state.zoom.mul(1.5),
        }).run();
    };

    const zoomOut = () => {
        new ZoomAction(store, {
            to: store.state.zoom.div(1.5),
        }).run();
    };

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
                <a title="Zoom in" onClick={zoomIn}>
                    <span className="material-icons">zoom_in</span>
                </a>
                <a title="Zoom out" onClick={zoomOut}>
                    <span className="material-icons">zoom_out</span>
                </a>
            </div>
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
        </div>
    );
};
