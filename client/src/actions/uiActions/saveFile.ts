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

    /**
     * This creates a "file" by converting it into a blob string and setting it on an
     * <a> element in the document. It then clicks the link, which brings up a save dialog
     * to the user with the blob string as the contents.
     *
     * NOTE: In order for this to work correctly, this should be handled in an input event
     * handler. For example, a "click" event from a button calls this action.
     *
     * If this isn't called from a "reactive context" (i.e. an event handler) Firefox will
     * block the .click() call.
     */
    run(): void {
        const data = encodeURI(this.args.data);
        const mimeType = this.args.mimeType ?? "text/plain";

        elDownloadLink.href = `data:${mimeType};charset=utf-8,${data}`;
        elDownloadLink.download = this.args.fileName;
        elDownloadLink.click();
    }
}
