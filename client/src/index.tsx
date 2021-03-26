import "./assets";

import Fraction from "fraction.js";
import React from "react";
import { render } from "react-dom";
import { Beat } from "./charting/beat";
import { Chart } from "./charting/chart";
import { Tap } from "./charting/objects/tap";
import { Time } from "./charting/time";
import { BeatSnap } from "./notefield/beatsnap";
import { Baseline, NoteFieldConfig, NoteFieldState } from "./notefield/config";
import { NoteField } from "./components/NoteField";
import { getNoteSkinSource, loadNoteSkin } from "./noteskin";
import { Store } from "./store/store";
import { App } from "./components/App";

export let store: Store;

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
            wholeBeatLines: {
                color: "#555",
                lineWidth: 2,
            },
            fractionalLines: {
                color: "#333",
                lineWidth: 1,
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
                snapNext: "ArrowRight",
                snapPrev: "ArrowLeft",
            },
        },

        baseline: Baseline.Centered,
        chart,
        columnWidth: 128,
        keyCount: 4,
        noteSkin: skin,
        pixelsPerSecond: 512,
        margin: 384,
        scrollDirection: "up",
    };

    const state: NoteFieldState = {
        width: config.columnWidth * chart.keyCount.value,
        height: 1,

        zoom: new Fraction(1),
        scroll: { beat: Beat.Zero, time: Time.Zero },
        snap: new BeatSnap(),
    };

    store = new Store(config, state);

    render(
        <App store={store} />,
        document.getElementById("app") as HTMLElement,
    );
});
