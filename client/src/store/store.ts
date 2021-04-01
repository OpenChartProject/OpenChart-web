import assert from "assert";
import Fraction from "fraction.js";
import { makeAutoObservable, observable } from "mobx";

import { Beat, BeatTime, Chart, Time } from "../charting/";
import { NoteFieldConfig, NoteFieldState, ScrollDirection } from "../notefield/config";

import { AutoScroller } from "./autoScroller";
import { EditorConfigStore } from "./editorConfig";
import { Music } from "./music";
import { NoteFieldStore } from "./noteField";
import { UserConfigStorage } from "./userConfig";

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
