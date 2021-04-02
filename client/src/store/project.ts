import _ from "lodash";
import { makeAutoObservable } from "mobx";
import { Project, SongData } from "../project";
import { RootStore } from "./store";

export class ProjectStore {
    project: Project;
    root: RootStore;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            root: false,
        });

        this.root = root;
        this.project = { charts: [], song: { artist: "", title: "" } };
    }

    updateSong(data: Partial<SongData>) {
        this.project.song = _.merge(this.project.song, data);
    }
}
