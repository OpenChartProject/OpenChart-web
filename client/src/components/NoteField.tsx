import { observer } from "mobx-react-lite";
import { deepObserve } from "mobx-utils";
import React, { useEffect, useRef } from "react";

import { drawNoteField } from "../notefield/drawing";
import { inputToAction } from "../notefield/input";
import { RootStore } from "../store/";

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
    const ref = useRef<HTMLCanvasElement>(null);

    const redraw = () => {
        if (!ref.current) return;

        drawNoteField(store);
    }

    const onKeyDown = (e: KeyboardEvent) => {
        const action = inputToAction({ type: "keydown", event: e }, store);

        if (action) {
            action.run();
        }
    }

    const onScroll = (e: WheelEvent) => {
        const action = inputToAction({ type: "wheel", event: e }, store);

        if (action) {
            action.run();
        }
    }

    const updateDim = () => {
        const el = ref.current;

        if (!el) return;

        el.height = el.clientHeight;
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

        store.noteField.setCanvas(ref.current);
        updateDim();
    }, [ref]);

    return <canvas className="notefield" ref={ref}></canvas>;
});
