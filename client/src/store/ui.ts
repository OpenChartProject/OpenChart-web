import _ from "lodash";
import { makeAutoObservable } from "mobx";

import { KeyBinds } from "../notefield/input";

import { RootStore } from "./store";

export interface UIData {
    keyBinds: KeyBinds;
    enableMetronome: boolean;
    sidePanelVisible: boolean;
    showWelcomeModal: boolean;
}

export class UIStore {
    readonly STORAGE_KEY = "ui";

    data!: UIData;
    readonly root: RootStore;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            defaults: false,
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

    get defaults(): UIData {
        return {
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

            enableMetronome: true,
            sidePanelVisible: true,
            showWelcomeModal: true,
        };
    }

    /**
     * Updates the config with the provided changes and saves it.
     */
    update(config: Partial<UIData>) {
        this.data = _.merge(this.data || {}, config);
        this.save();
    }

    /**
     * Saves the editor config to the user's local storage.
     */
    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    }
}
