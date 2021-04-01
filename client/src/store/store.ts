import { makeAutoObservable } from "mobx";


import { EditorConfigStore } from "./editorConfig";
import { NoteFieldStore } from "./noteField";

/**
 * The store for the application.
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
