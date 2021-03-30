import _ from "lodash";

import { ScrollDirection } from "../notefield/config";

const storageKey = "userConfig";

export interface UserConfig {
    enableMetronome: boolean;
    scrollDirection: ScrollDirection;
}

export class UserConfigStorage {
    config: UserConfig;

    constructor() {
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

    getDefaults(): UserConfig {
        return {
            enableMetronome: true,
            scrollDirection: "up",
        };
    }

    save() {
        localStorage.setItem(storageKey, JSON.stringify(this.config));
    }

    static update(config: Partial<UserConfig>) {
        const storage = new UserConfigStorage();
        storage.config = _.merge(storage.config, config);
        storage.save();
    }
}
