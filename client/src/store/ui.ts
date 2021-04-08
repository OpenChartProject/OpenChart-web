import { EventEmitter } from "events";
import _ from "lodash";
import { makeAutoObservable } from "mobx";

import { KeyBinds } from "../notefield/input";

import { RootStore } from "./store";

export interface PanelVisibility {
    audio: boolean;
    beatTime: boolean;
    songInfo: boolean;
    noteFieldSettings: boolean;
}

export interface MetronomeData {
    enabled: boolean;
    volume: number;
}

export interface UIData {
    metronome: MetronomeData;
    sidePanelVisible: boolean;
    showWelcomeModal: boolean;

    keyBinds: KeyBinds;
    panelVisibility: PanelVisibility;
}

export class UIStore {
    readonly STORAGE_KEY = "ui";

    data!: UIData;
    metronomeTicker: EventEmitter;
    readonly root: RootStore;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            defaults: false,
        });

        this.root = root;
        this.metronomeTicker = new EventEmitter();

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

    get defaults(): UIData {
        return {
            metronome: {
                enabled: true,
                volume: 0.8,
            },

            sidePanelVisible: true,
            showWelcomeModal: true,

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

            panelVisibility: {
                audio: true,
                beatTime: true,
                songInfo: true,
                noteFieldSettings: true,
            },
        };
    }

    onTick() {
        this.metronomeTicker.emit("tick");
    }

    /**
     * Updates the config with the provided changes and saves it.
     */
    update(config: Partial<UIData>) {
        this.data = _.merge(this.data || {}, config);
        this.save();
    }

    updateMetronome(config: Partial<MetronomeData>) {
        this.data.metronome = _.merge(this.data.metronome || {}, config);
        this.save();
    }

    updatePanelVisibility(config: Partial<PanelVisibility>) {
        this.data.panelVisibility = _.merge(this.data.panelVisibility || {}, config);
        this.save();
    }

    /**
     * Saves the editor config to the user's local storage.
     */
    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    }
}
