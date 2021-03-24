import Fraction from "fraction.js";
import { Beat } from "./charting/beat";
import { Chart } from "./charting/chart";
import { Time } from "./charting/time";
import { BeatSnap } from "./notefield/beatsnap";
import { NoteFieldConfig, Baseline, NoteFieldState } from "./notefield/config";
import { NoteSkin } from "./noteskin";
import { RootStore } from "./store/store";

/**
 * Returns a dummy noteskin for testing. The noteskin doesn't refer to any actual
 * images, but it does include a width and height for each asset.
 */
export function createDummyNoteSkin(keyCount = 4): NoteSkin {
    const dim = { width: 128, height: 128 };
    const ns: NoteSkin = {
        name: "dummy-skin",
        keyCount,
        hold: [],
        holdBody: [],
        receptor: [],
        tap: [],
    };

    for (let i = 0; i < keyCount; i++) {
        ns.hold.push(dim as any);
        ns.holdBody.push(dim as any);
        ns.receptor.push(dim as any);
        ns.tap.push(dim as any);
    }

    return ns;
}

/**
 * Returns a new store with reasonable defaults, useful for testing.
 */
export function createStore(chart?: Chart): RootStore {
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
                snapNext: "ArrowRight",
                snapPrev: "ArrowLeft",
            },
        },

        baseline: Baseline.Centered,
        chart: chart ?? new Chart(),
        columnWidth: 128,
        keyCount: 4,
        noteSkin: createDummyNoteSkin(),
        pixelsPerSecond: 512,
        margin: 384,
    };

    const state: NoteFieldState = {
        width: config.columnWidth * config.chart.keyCount.value,
        height: 1,

        scaleY: new Fraction(1),
        scroll: { beat: Beat.Zero, time: Time.Zero },
        snap: new BeatSnap(),
    };

    return new RootStore(config, state);
}
