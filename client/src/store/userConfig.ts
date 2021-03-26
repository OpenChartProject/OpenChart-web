import { ScrollDirection } from "../notefield/config";
import _ from "lodash";

const storageKey = "userConfig";

export interface UserConfig {
    scrollDirection: ScrollDirection;
}

export class UserConfigStorage {
    config: UserConfig;

    constructor() {
        const existing = localStorage.getItem(storageKey);

        if (existing === null) {
            this.config = this.getDefaults();
            this.save();
        } else {
            this.config = JSON.parse(existing);
        }
    }

    getDefaults(): UserConfig {
        return {
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
