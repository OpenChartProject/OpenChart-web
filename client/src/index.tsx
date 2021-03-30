import Fraction from "fraction.js";
import React from "react";
import { render } from "react-dom";

import "./assets";
import { Beat, Chart, Time } from "./charting/";
import { App } from "./components/";
import { BeatSnap } from "./notefield/beatsnap";
import { Baseline, NoteFieldConfig, NoteFieldState } from "./notefield/config";
import { getNoteSkinSource, loadNoteSkin } from "./noteskin";
import { Store, UserConfigStorage } from "./store/";

export let store: Store;

loadNoteSkin(getNoteSkinSource("default_4k", 4)).then((skin) => {
    const userConfig = new UserConfigStorage();

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
            playPause: " ",
        },

        baseline: Baseline.Centered,
        chart: new Chart(),
        columnWidth: 128,
        noteSkin: skin,
        pixelsPerSecond: 512,
        margin: 384,
        scrollDirection: userConfig.config.scrollDirection,
    };

    const state: NoteFieldState = {
        width: config.columnWidth * config.chart.keyCount.value,
        height: 1,

        zoom: new Fraction(1),
        scroll: { beat: Beat.Zero, time: Time.Zero },
        snap: new BeatSnap(),

        isPlaying: false,
    };

    store = new Store(config, state);

    render(<App store={store} />, document.getElementById("app") as HTMLElement);
});
