import { makeAutoObservable } from "mobx";


import { EditorConfigStore } from "./editorConfig";
import { NoteFieldStore } from "./noteField";

/**
 * The root store for the application that contains all of the application data.
 */
export class RootStore {
    readonly editor: EditorConfigStore;
    readonly noteField: NoteFieldStore;

    constructor(editor: EditorConfigStore, noteField: NoteFieldStore) {
        makeAutoObservable(this);

        this.editor = editor;
        this.noteField = noteField;
    }
}
