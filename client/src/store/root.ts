import { NotefieldStore } from "./notefield";
import { NotefieldDisplayStore } from "./notefieldDisplay";
import { ProjectStore } from "./project";
import { UIStore } from "./ui";
import { WaveformStore } from "./waveform";

/**
 * The root store for the application that contains all of the application data.
 */
export class RootStore {
    readonly notefieldDisplay: NotefieldDisplayStore;
    readonly notefield: NotefieldStore;
    readonly project: ProjectStore;
    readonly waveform: WaveformStore;
    readonly ui: UIStore;

    constructor() {
        this.ui = new UIStore(this);
        this.notefieldDisplay = new NotefieldDisplayStore(this);
        this.project = new ProjectStore(this);
        this.waveform = new WaveformStore(this);

        // The NotefieldStore needs to be created last since it depends on the other
        // stores as part of its initialization.
        this.notefield = new NotefieldStore(this);
    }
}
