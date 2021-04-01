import _ from "lodash";
import { makeAutoObservable } from "mobx";

import { ScrollDirection } from "../notefield/config";
import { RootStore } from "./store";

const storageKey = "config";

/**
 * The editor config. This config applies to all notefields and is saved to the user's
 * local storage.
 */
export interface EditorConfig {
    enableMetronome: boolean;
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
            getDefaults: false,
            save: false,
        });

        this.root = root;

        const defaults = this.getDefaults();
        const existing = localStorage.getItem(storageKey);

        if (!existing) {
            this.config = defaults;
            this.save();
        } else {
            this.config = JSON.parse(existing);
            this.config = _.merge(defaults, this.config);
        }
    }

    getDefaults(): EditorConfig {
        return {
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
