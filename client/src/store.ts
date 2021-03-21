import { makeAutoObservable } from "mobx";

import { NoteFieldConfig, NoteFieldState } from "./notefield/config";

export class RootStore {
    config: NoteFieldConfig;
    state: NoteFieldState;

    constructor(config: NoteFieldConfig, state: NoteFieldState) {
        makeAutoObservable(this);
        this.config = config;
        this.state = state;
    }
}
