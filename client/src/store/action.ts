import { Action } from "../actions/action";
import { RootStore } from "./root";

export class ActionStore {
    readonly root: RootStore;

    stack: {
        undo: Action[];
        redo: Action[];
    };

    constructor(root: RootStore) {
        this.root = root;

        this.stack = {
            undo: [],
            redo: [],
        };
    }

    canUndo(): boolean {
        return this.stack.undo.length > 0;
    }

    canRedo(): boolean {
        return this.stack.redo.length > 0;
    }

    run(action: Action) {
        action.run();
        this.stack.redo = [];
        this.stack.undo.push(action);
    }

    undo() {
        const action = this.stack.undo.pop();

        if (!action) {
            return;
        }

        action.undo();
        this.stack.redo.push(action);
    }

    redo() {
        const action = this.stack.redo.pop();

        if (!action) {
            return;
        }

        action.run();
        this.stack.undo.push(action);
    }
}
