import { getFormatFromFileName, loadFromString } from "../../formats/formats";
import { Store } from "../../store";
import { Action } from "../action";

export interface OpenFileArgs {
    file: File;
}

export class OpenFileAction implements Action {
    args: OpenFileArgs;
    store: Store;

    constructor(store: Store, args: OpenFileArgs) {
        this.store = store;
        this.args = args;
    }

    run(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            const f = this.args.file;
            const format = getFormatFromFileName(f.name);

            if (format) {
                reader.onload = () => {
                    const text = reader.result as string;
                    const project = loadFromString(format, text);
                    this.store.setChart(project.charts[0]);
                    resolve();
                };

                reader.readAsText(f);
            } else if (f.name.match(/\.(mp3|wav|ogg)$/i)) {
                reader.onload = () => {
                    const data = reader.result as string;
                    this.store.setMusic(data);

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
