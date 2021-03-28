import Fraction from "fraction.js";
import _ from "lodash";

import { Beat, Chart, Time } from "./charting/";
import { BeatSnap } from "./notefield/beatsnap";
import { Baseline, NoteFieldConfig, NoteFieldState } from "./notefield/config";
import { NoteSkin } from "./noteskin";
import { Store } from "./store/";

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

export interface CreateStoreArgs {
    chart?: Chart;
    config?: Partial<NoteFieldConfig>;
    state?: Partial<NoteFieldState>;
}

/**
 * Returns a new store with reasonable defaults, useful for testing.
 */
export function createStore(args: CreateStoreArgs = {}): Store {
    let config: NoteFieldConfig = {
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
        chart: args.chart ?? new Chart(),
        columnWidth: 128,
        keyCount: 4,
        margin: 384,
        noteSkin: createDummyNoteSkin(),
        pixelsPerSecond: 512,
        scrollDirection: "up",
    };

    let state: NoteFieldState = {
        width: config.columnWidth * config.chart.keyCount.value,
        height: 800,

        zoom: new Fraction(1),
        scroll: { beat: Beat.Zero, time: Time.Zero },
        snap: new BeatSnap(),
    };

    if (args.config) {
        config = _.merge(config, args.config);
    }

    if (args.state) {
        state = _.merge(state, args.state);
    }

    return new Store(config, state);
}
