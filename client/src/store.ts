import { NoteFieldConfig, NoteFieldState } from "./notefield/config";

export class RootStore {
    config: NoteFieldConfig;
    state: NoteFieldState;

    constructor(config: NoteFieldConfig, state: NoteFieldState) {
        this.config = config;
        this.state = state;
    }
}
