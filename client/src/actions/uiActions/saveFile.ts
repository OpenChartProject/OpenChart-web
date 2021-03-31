
import { Action } from "../action";

const elDownloadLink = document.getElementById("download-link") as HTMLAnchorElement;

/**
 * Arguments for the SaveFileAction.
 */
export interface SaveFileArgs {
    data: string;
    fileName: string;
    mimeType?: string;
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
        const data = encodeURI(this.args.data);
        const mimeType = this.args.mimeType ?? "text/plain";

        elDownloadLink.href = `data:${mimeType};charset=utf-8,${data}`;
        elDownloadLink.download = this.args.fileName;
        elDownloadLink.click();
    }
}
