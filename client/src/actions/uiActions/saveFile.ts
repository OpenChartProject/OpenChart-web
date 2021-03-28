import { deflate } from "pako";

import { Action } from "../action";

const elDownloadLink = document.getElementById("download-link") as HTMLAnchorElement;

/**
 * Arguments for the SaveFileAction.
 */
export interface SaveFileArgs {
    compress?: boolean;
    data: string;
    fileName: string;
    mimeType: string;
}

/**
 * Action for saving a file to the user's machine.
 */
export class SaveFileAction implements Action {
    args: SaveFileArgs;

    constructor(args: SaveFileArgs) {
        this.args = args;
    }

    run(): void {
        let data = this.args.data;

        if (this.args.compress) {
            data = deflate(data).toString();
        }

        data = encodeURI(data);

        elDownloadLink.href = `data:${this.args.mimeType};charset=utf-8,${data}`;
        elDownloadLink.download = this.args.fileName;
        elDownloadLink.click();
    }
}
