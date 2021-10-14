export interface Action {
    run(): void;
    undo(): void;
}
