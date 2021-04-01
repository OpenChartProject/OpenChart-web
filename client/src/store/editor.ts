import _ from "lodash";
import { action, makeObservable, observable } from "mobx";
import { ScrollDirection } from "../notefield/config";

const storageKey = "config";

export interface EditorConfig {
    enableMetronome: boolean;
    scrollDirection: ScrollDirection;
}

export class EditorConfigStore {
    config: EditorConfig;

    constructor() {
        makeObservable(this, {
            config: observable,
            update: action,
        });

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

    update(config: Partial<EditorConfig>) {
        this.config = _.merge(this.config, config);
        this.save();
    }
}
