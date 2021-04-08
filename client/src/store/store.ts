import { EditorStore } from "./editor";
import { NoteFieldStore } from "./noteField";
import { ProjectStore } from "./project";
import { UIStore } from "./ui";
import { WaveformStore } from "./waveform";

/**
 * The root store for the application that contains all of the application data.
 */
export class RootStore {
    readonly editor: EditorStore;
    readonly noteField: NoteFieldStore;
    readonly project: ProjectStore;
    readonly waveform: WaveformStore;
    readonly ui: UIStore;

    constructor() {
        this.ui = new UIStore(this);
        this.editor = new EditorStore(this);
        this.project = new ProjectStore(this);
        this.waveform = new WaveformStore(this);

        // The NoteFieldStore needs to be created last since it depends on the other
        // stores as part of its initialization.
        this.noteField = new NoteFieldStore(this);
    }
}
