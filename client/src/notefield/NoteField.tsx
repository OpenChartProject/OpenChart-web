import React, { useEffect, useRef } from "react";
import { deepObserve } from "mobx-utils";
import { observer } from "mobx-react-lite";
import { drawNoteField } from "./drawing";
import { RootStore } from "../store/store";
import { inputToAction } from "./input";
import { SnapScrollAction, SnapScrollArgs } from "../store/actions/";

export interface Props {
    store: RootStore;
}

/**
 * The NoteField component.
 *
 * This component doesn't do much on its own. It's mainly responsible for creating
 * a canvas element and setting up event listeners.
 *
 * This observes the store and will redraw anytime there are changes.
 *
 * It's important that changes to the store are handled using actions, otherwise the
 * changes are not broadcasted and the notefield won't redraw.
 */
export const NoteField = observer(({ store }: Props) => {
    const { config, state } = store;
    const ref = useRef<HTMLCanvasElement>(null);

    function redraw() {
        if (!ref.current) return;

        drawNoteField(ref.current, config, state);
    }

    function onKeyDown(e: KeyboardEvent) {
        const action = inputToAction(e, store);

        if (action) {
            action.run();
        }
    }

    function onScroll(e: WheelEvent) {
        if (e.deltaY === 0) {
            return;
        }

        e.preventDefault();

        const args: SnapScrollArgs = {
            direction: e.deltaY > 0 ? "forward" : "backward",
        };

        new SnapScrollAction(store, args).run();
    }

    function updateDim() {
        if (!ref.current) return;

        store.setHeight(ref.current.clientHeight);
    }

    // Watch the entire store for changes so we know when to redraw.
    // NOTE: mobx only picks up on changes that happen inside actions, i.e. methods
    // on an object that has makeAutoObservable called in its constructor.
    useEffect(() => {
        const disposer = deepObserve(store, () => redraw());
        return disposer;
    }, []);

    // Setup event listener for handling page resizes.
    useEffect(() => {
        window.addEventListener("resize", updateDim);
        return () => window.removeEventListener("resize", updateDim);
    }, []);

    // Setup event listeners for key presses and scrolling.
    useEffect(() => {
        document.body.addEventListener("keydown", onKeyDown);
        document.body.addEventListener("wheel", onScroll, { passive: false });

        return () => {
            document.body.removeEventListener("keydown", onKeyDown);
            document.body.removeEventListener("wheel", onScroll);
        };
    }, []);

    // Update the dimensions once we have a reference to the element.
    useEffect(() => {
        if (!ref.current) return;

        store.setCanvas(ref.current);
        updateDim();
    }, [ref]);

    return <canvas ref={ref}></canvas>;
});
