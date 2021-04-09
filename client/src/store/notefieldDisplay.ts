import _ from "lodash";
import { makeAutoObservable } from "mobx";

import { NoteSkin } from "../noteskin";
import { DeepPartial } from "../util";

import { RootStore } from "./store";

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

export interface BeatLineSettings {
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
}

/**
 * The editor config. This config applies to all notefields and is saved to the user's
 * local storage.
 */
export interface NotefieldDisplayData {
    beatLines: BeatLineSettings;
    baseline: Baseline;
    columnWidth: number;
    receptorY: number;
    noteSkin?: NoteSkin;
    pixelsPerSecond: number;
    scrollDirection: ScrollDirection;
    showWaveform: boolean;
}

/**
 * The store for the editor config.
 */
export class NotefieldDisplayStore {
    readonly STORAGE_KEY = "editor";

    data!: NotefieldDisplayData;
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
        const existing = localStorage.getItem(this.STORAGE_KEY);

        if (!existing) {
            this.update(defaults);
        } else {
            this.data = JSON.parse(existing);
            this.data = _.merge(defaults, this.data);
        }
    }

    get defaults(): NotefieldDisplayData {
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

            baseline: Baseline.Centered,
            columnWidth: 128,
            pixelsPerSecond: 512,
            receptorY: 384,
            scrollDirection: "up",
            showWaveform: true,
        };
    }

    /**
     * Updates the config with the provided changes and saves it.
     */
    update(config: DeepPartial<NotefieldDisplayData>) {
        this.data = _.merge(this.data || {}, config);
        this.save();

        // Update the canvas width when the column width changes.
        if (config.columnWidth !== undefined) {
            this.root.noteField?.updateWidth();
        }
    }

    /**
     * Saves the editor config to the user's local storage.
     */
    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    }
}
