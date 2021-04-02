import { EditorStore } from "./editor";
import { NoteFieldStore } from "./noteField";
import { ProjectStore } from "./project";
import { UIStore } from "./ui";

/**
 * The root store for the application that contains all of the application data.
 */
export class RootStore {
    readonly editor: EditorStore;
    readonly noteField: NoteFieldStore;
    readonly project: ProjectStore;
    readonly ui: UIStore;

    constructor() {
        this.editor = new EditorStore(this);
        this.noteField = new NoteFieldStore(this);
        this.project = new ProjectStore(this);
        this.ui = new UIStore(this);
    }
}
