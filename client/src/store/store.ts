import { EditorConfigStore } from "./editorConfig";
import { NoteFieldStore } from "./noteField";
import { ProjectStore } from "./project";

/**
 * The root store for the application that contains all of the application data.
 */
export class RootStore {
    readonly editor: EditorConfigStore;
    readonly noteField: NoteFieldStore;
    readonly project: ProjectStore;

    constructor() {
        this.editor = new EditorConfigStore(this);
        this.noteField = new NoteFieldStore(this);
        this.project = new ProjectStore(this);
    }
}
