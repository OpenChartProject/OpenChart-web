import { observer } from "mobx-react-lite";
import React from "react";

import { ScrollDirectionAction, ZoomAction } from "../actions/noteFieldActions";
import { OpenFileAction, OpenFileDialogAction, SaveFileAction } from "../actions/uiActions";
import { discord, github } from "../assets";
import { Chart } from "../charting";
import { Formats, writeToString } from "../formats/formats";
import { Project } from "../project";
import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const Toolbar = observer((props: Props) => {
    const { store } = props;

    const metronome = (enableMetronome: boolean) => {
        return () => {
            store.ui.update({ enableMetronome });
        };
    };

    const newFile = () => {
        store.noteField.setChart(new Chart());
    };

    const openFilePicker = () => {
        const action = new OpenFileDialogAction({ accept: [".sm", ".oc", ".ocz", "audio/*"] });

        action.run().then((files) => {
            new OpenFileAction(store, { file: files[0] }).run();
        });
    };

    const saveFile = () => {
        const project: Project = {
            charts: [store.noteField.chart],
            song: store.project.data.song,
        };

        const format = Formats[".ocz"];
        const data = writeToString(format, project);

        new SaveFileAction({ data, fileName: `project${format.ext}` }).run();
    };

    const swapScrollDirection = () => {
        new ScrollDirectionAction(store, { to: "swap" }).run();
    };

    const zoomIn = () => {
        new ZoomAction(store, {
            to: store.noteField.data.zoom.mul(1.5),
        }).run();
    };

    const zoomOut = () => {
        new ZoomAction(store, {
            to: store.noteField.data.zoom.div(1.5),
        }).run();
    };

    return (
        <div className="sidebar-container">
            <div className="toolbar">
                <a title="New chart" onClick={newFile}>
                    <span className="material-icons-outlined">add</span>
                </a>
                <a title="Open chart" onClick={openFilePicker}>
                    <span className="material-icons-outlined">upload_file</span>
                </a>
                <a title="Download chart" onClick={saveFile}>
                    <span className="material-icons-outlined">save_alt</span>
                </a>

                <div className="divider"></div>

                <a title="Zoom in" onClick={zoomIn}>
                    <span className="material-icons-outlined">zoom_in</span>
                </a>
                <a title="Zoom out" onClick={zoomOut}>
                    <span className="material-icons-outlined">zoom_out</span>
                </a>

                <div className="divider"></div>

                <a title="Swap scroll direction" onClick={swapScrollDirection}>
                    <span className="material-icons-outlined">swap_vert</span>
                </a>

                {store.ui.data.enableMetronome ? (
                    <a title="Disable metronome" onClick={metronome(false)}>
                        <span className="material-icons-outlined">timer</span>
                    </a>
                ) : (
                    <a title="Enable metronome" onClick={metronome(true)}>
                        <span className="material-icons-outlined">timer_off</span>
                    </a>
                )}
            </div>
            <div className="footer">
                <a
                    href="https://github.com/OpenChartProject/OpenChart-web/issues/new"
                    title="Report a bug or issue"
                    target="_blank"
                >
                    <span className="material-icons-outlined report-icon">report</span>
                </a>
                <div className="divider"></div>
                <a href="https://discord.gg/wSGmN52" title="Visit us on Discord" target="_blank">
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
});
