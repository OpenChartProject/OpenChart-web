import { Action } from "../action";

const elFilePicker = document.getElementById("file-picker") as HTMLInputElement;

/**
 * Arguments for the OpenFileAction.
 */
export interface OpenFileArgs {
    accept: string[];
    multiple?: boolean;
}

/**
 * Action for displaying a file picker dialog.
 */
export class OpenFileAction implements Action {
    args: OpenFileArgs;

    constructor(args: OpenFileArgs) {
        this.args = args;
    }

    /**
     * Opens the file picker dialog and returns a promise that resolves to the list of
     * files picked by the user. If the user closes the dialog without picking anything
     * the promise will not resolve or reject.
     */
    run(): Promise<FileList> {
        elFilePicker.files = null;
        elFilePicker.accept = this.args.accept.join(",");
        elFilePicker.multiple = this.args.multiple === true;

        return new Promise<FileList>((resolve) => {
            elFilePicker.onchange = () => resolve(elFilePicker.files as FileList);
            elFilePicker.click();
        });
    }
}
