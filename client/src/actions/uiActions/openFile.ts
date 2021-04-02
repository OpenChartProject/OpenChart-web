import { getFormatFromFileName, loadFromString } from "../../formats/formats";
import { RootStore } from "../../store";
import { Action } from "../action";

/**
 * Arguments for the OpenFileAction.
 */
export interface OpenFileArgs {
    file: File;
}

/**
 * Action for reading and parsing a file that the user has selected. This supports opening
 * charts and audio files.
 */
export class OpenFileAction implements Action {
    args: OpenFileArgs;
    store: RootStore;

    constructor(store: RootStore, args: OpenFileArgs) {
        this.store = store;
        this.args = args;
    }

    /**
     * Reads the provided file and uses its name to determine the format.
     *
     * If the file is a recognized chart/project format, it's loaded in and the chart
     * is displayed to the user. If it's an audio file, it sets that as the current music source.
     *
     * This returns a promise that resolves if the file was handled, and rejected if the
     * file type is unknown or not supported.
     */
    run(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            const f = this.args.file;
            const format = getFormatFromFileName(f.name);

            if (format) {
                reader.onload = () => {
                    const text = reader.result as string;
                    const project = loadFromString(format, text);
                    this.store.noteField.setChart(project.charts[0]);
                    resolve();
                };

                reader.readAsText(f);
            } else if (f.name.match(/\.(mp3|wav|ogg)$/i)) {
                reader.onload = () => {
                    const data = reader.result as string;
                    this.store.noteField.setMusic(data);

                    resolve();
                };

                reader.readAsDataURL(f);
            } else {
                console.warn("Unrecognized file type:", f.name);
                reject();
            }
        });
    }
}
