import _ from "lodash";
import { makeAutoObservable } from "mobx";

import { Project, SongData } from "../project";

import { RootStore } from "./root";

export class ProjectStore {
    data: Project;
    root: RootStore;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            root: false,
        });

        this.root = root;
        this.data = { charts: [], song: { artist: "", title: "", audioOffset: 0 } };
    }

    setProject(project: Project) {
        this.data = project;
    }

    updateSong(data: Partial<SongData>) {
        this.data.song = _.merge(this.data.song, data);
    }
}
