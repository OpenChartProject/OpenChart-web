import React from "react";
import { render } from "react-dom";
import { Beat } from "./charting/beat";
import { Chart } from "./charting/chart";
import { Tap } from "./charting/objects/tap";
import { Time } from "./charting/time";
import { Baseline, NoteFieldConfig, NoteFieldState } from "./notefield/config";
import { NoteField } from "./notefield/NoteField";
import { getNoteSkinSource, loadNoteSkin } from "./noteskin";
import { RootStore } from "./store";

export let store: RootStore;

const chart = new Chart();
chart.objects[0].push(new Tap(0, 0));
chart.objects[1].push(new Tap(1, 1));
chart.objects[2].push(new Tap(2, 2));
chart.objects[3].push(new Tap(3, 3));

loadNoteSkin(getNoteSkinSource("default_4k", 4)).then((skin) => {
    const config: NoteFieldConfig = {
        beatLines: {
            measureLines: {
                color: "#999",
                lineWidth: 3,
            },
            nonMeasureLines: {
                color: "#555",
                lineWidth: 2,
            },
        },

        colors: {
            background: "#000",
        },

        keyBinds: {
            keys: {
                4: ["1", "2", "3", "4"],
            },
            scroll: {
                up: "ArrowUp",
                down: "ArrowDown",
            },
        },

        baseline: Baseline.Centered,
        chart,
        columnWidth: 128,
        keyCount: 4,
        noteSkin: skin,
        pixelsPerSecond: 512,
        secondsPerScrollTick: 0.25,
        margin: 384,
    };

    const state: NoteFieldState = {
        width: config.columnWidth * chart.keyCount.value,
        height: 1,
        scroll: { beat: Beat.Zero, time: Time.Zero },
    };

    store = new RootStore(config, state);

    render(
        <NoteField store={store} />,
        document.getElementById("app") as HTMLElement,
    );
});
