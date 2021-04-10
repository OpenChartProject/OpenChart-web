import { Action } from "../action";

const elFilePicker = document.getElementById("file-picker") as HTMLInputElement;

/**
 * Arguments for the OpenFileDialogAction.
 */
export interface OpenFileDialogArgs {
    accept: string[];
    el?: HTMLInputElement;
    multiple?: boolean;
}

/**
 * Action for displaying a file picker dialog.
 */
export class OpenFileDialogAction implements Action {
    args: OpenFileDialogArgs;
    el: HTMLInputElement;

    constructor(args: OpenFileDialogArgs) {
        this.args = args;
        this.el = this.args.el ?? elFilePicker;
    }

    /**
     * Opens the file picker dialog and returns a promise that resolves to the list of
     * files picked by the user. If the user closes the dialog without picking anything
     * the promise will not resolve or reject.
     */
    run(): Promise<FileList> {
        this.el.accept = this.args.accept.join(",");
        this.el.multiple = this.args.multiple === true;

        return new Promise<FileList>((resolve) => {
            this.el.onchange = () => resolve(this.el.files as FileList);
            this.el.click();
        });
    }
}
