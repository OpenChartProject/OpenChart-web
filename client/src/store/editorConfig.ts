import _ from "lodash";
import { makeAutoObservable } from "mobx";

import { KeyBinds } from "../notefield/input";
import { NoteSkin } from "../noteskin";
import { RootStore } from "./store";

const storageKey = "config";

/**
 * The different baseline options for how the notefield is displayed. This affects
 * how objects are aligned relative to the beat lines.
 */
 export enum Baseline {
    Before,
    Centered,
    After,
}

/**
 * The scroll direction of the notefield.
 */
export type ScrollDirection = "up" | "down";

/**
 * The editor config. This config applies to all notefields and is saved to the user's
 * local storage.
 */
export interface EditorConfig {
    beatLines: {
        measureLines: {
            color: string;
            lineWidth: number;
        };

        wholeBeatLines: {
            color: string;
            lineWidth: number;
        };

        fractionalLines: {
            color: string;
            lineWidth: number;
        };
    };

    colors: {
        background: string;
    };

    baseline: Baseline;
    columnWidth: number;
    enableMetronome: boolean;
    keyBinds: KeyBinds;
    margin: number;
    noteSkin?: NoteSkin;
    pixelsPerSecond: number;
    scrollDirection: ScrollDirection;
}

/**
 * The store for the editor config.
 */
export class EditorConfigStore {
    readonly config: EditorConfig;
    readonly root: RootStore;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            defaults: false,
            save: false,
        });

        this.root = root;

        const defaults = this.defaults;
        const existing = localStorage.getItem(storageKey);

        if (!existing) {
            this.config = defaults;
            this.save();
        } else {
            this.config = JSON.parse(existing);
            this.config = _.merge(defaults, this.config);
        }
    }

    get defaults(): EditorConfig {
        return {
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
            columnWidth: 128,
            pixelsPerSecond: 512,
            margin: 384,
            enableMetronome: true,
            scrollDirection: "up",
        };
    }

    save() {
        localStorage.setItem(storageKey, JSON.stringify(this.config));
    }

    /**
     * Enables or disables the metronome.
     */
    setMetronome(enabled: boolean) {
        this.config.enableMetronome = enabled;
        this.save();
    }

    /**
     * Sets the scroll direction of the notefield.
     */
    setScrollDirection(direction: ScrollDirection) {
        this.config.scrollDirection = direction;
        this.save();
    }
}
