import _ from "lodash";
import { makeAutoObservable } from "mobx";

import { Project, SongData } from "../project";

import { RootStore } from "./store";

export class ProjectStore {
    data: Project;
    root: RootStore;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            root: false,
        });

        this.root = root;
        this.data = { charts: [], song: { artist: "", title: "" } };
    }

    updateSong(data: Partial<SongData>) {
        this.data.song = _.merge(this.data.song, data);
    }
}
