import _ from "lodash";
import { makeAutoObservable } from "mobx";

import { NoteSkin } from "../noteskin";
import Storage from "../storage";

import { RootStore } from "./root";

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

export interface BeatLineStyle {
    color: string;
    lineWidth: number;
}

/**
 * The display settings for beat lines.
 */
export interface BeatLineSettings {
    // These lines occur on every 4th beat
    measureLines: BeatLineStyle;

    // These lines occur on every whole beat (1, 2, 3...)
    wholeBeatLines: BeatLineStyle;

    // These lines occur on any beat value that isn't a whole number. They are used when
    // drawing the lines for the beat snapping.
    fractionalLines: BeatLineStyle;
}

/**
 * The data used to describe the look and feel of all notefields.
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
    showWaveformWhilePlaying: boolean;
    highQualityWaveform: boolean;
}

/**
 * This store manages the look and feel of all notefields.
 *
 * Any updates made to the notefield display are saved to localStorage.
 */
export class NotefieldDisplayStore {
    static readonly STORAGE_KEY = "editor";

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
        const existing = Storage.get(NotefieldDisplayStore.STORAGE_KEY);

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
            showWaveformWhilePlaying: true,
            highQualityWaveform: true,
        };
    }

    /**
     * Updates the config with the provided changes and saves it.
     */
    update(config: Partial<NotefieldDisplayData>) {
        this.data = _.merge(this.data || {}, config);
        this.save();

        // Update the canvas width when the column width changes.
        if (config.columnWidth !== undefined) {
            this.root.notefield?.updateWidth();
        }
    }

    /**
     * Updates a specific property in the config and saves it.
     *
     * This is useful for doing updates on properties that are objects.
     */
    updateProperty<K extends keyof NotefieldDisplayData>(
        key: K,
        value: Partial<NotefieldDisplayData[K]>,
    ) {
        this.data[key] = _.merge(this.data[key] || {}, value) as NotefieldDisplayData[K];
        this.save();
    }

    /**
     * Saves the editor config to the user's local storage.
     */
    save() {
        const clone = _.cloneDeep(this.data);

        // Remove any properties we don't want saved
        delete clone.noteSkin;

        Storage.set(NotefieldDisplayStore.STORAGE_KEY, JSON.stringify(clone));
    }
}
