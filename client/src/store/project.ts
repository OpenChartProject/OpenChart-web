import _ from "lodash";
import { Project, SongData } from "../project";
import { RootStore } from "./store";

export class ProjectStore {
    project: Project;
    store: RootStore;

    constructor(store: RootStore) {
        this.store = store;
        this.project = {charts: [], song: {artist: "", title: ""}};
    }

    updateSong(data: Partial<SongData>) {
        this.project.song = _.merge(this.project.song, data);
    }
}
