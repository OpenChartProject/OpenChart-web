import { makeAutoObservable } from "mobx";
import { EditorConfigStore } from "./editorConfig";
import { NoteFieldStore } from "./noteField";

/**
 * The root store for the application that contains all of the application data.
 */
export class RootStore {
    readonly editor: EditorConfigStore;
    readonly noteField: NoteFieldStore;

    constructor() {
        this.editor = new EditorConfigStore(this);
        this.noteField = new NoteFieldStore(this);
    }
}
