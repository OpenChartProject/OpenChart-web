import { Action } from "../actions/action";
import { RootStore } from "./root";

export class ActionStore {
    readonly root: RootStore;

    stack: Action[];

    constructor(root: RootStore) {
        this.root = root;

        this.stack = [];
    }
}
