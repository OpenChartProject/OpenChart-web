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
    keyBinds: KeyBinds;
    margin: number;
    noteSkin?: NoteSkin;
    pixelsPerSecond: number;
    scrollDirection: ScrollDirection;

    enableMetronome: boolean;
    sidePanelVisible: boolean;
}

/**
 * The store for the editor config.
 */
export class EditorConfigStore {
    config!: EditorConfig;
    readonly root: RootStore;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            defaults: false,
            root: false,
            save: false,
        });

        this.root = root;

        // This loads the default editor config and overwrites it with the user's saved
        // config, if it exists.
        const defaults = this.defaults;
        const existing = localStorage.getItem(storageKey);

        if (!existing) {
            this.update(defaults);
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
            scrollDirection: "up",

            enableMetronome: true,
            sidePanelVisible: true,
        };
    }

    /**
     * Updates the config with the provided changes and saves it.
     */
    update(config: Partial<EditorConfig>) {
        this.config = _.merge(this.config || {}, config);
        this.save();
    }

    /**
     * Saves the editor config to the user's local storage.
     */
    save() {
        localStorage.setItem(storageKey, JSON.stringify(this.config));
    }
}
