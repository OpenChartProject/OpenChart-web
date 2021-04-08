import { observer } from "mobx-react-lite";
import { deepObserve } from "mobx-utils";
import React, { useEffect, useRef } from "react";

import { drawNoteField } from "../notefield/drawing";
import { inputToAction } from "../notefield/input";
import { RootStore } from "../store/";

import { BeatSnapDisplay } from "./BeatSnapDisplay";
import { Waveform } from "./Waveform";

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
    const refCanvas = useRef<HTMLCanvasElement>(null);
    const refContainer = useRef<HTMLDivElement>(null);

    const redraw = () => {
        if (!refCanvas.current) return;

        drawNoteField(store);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        const active = document.activeElement;

        // Ignore keydown events if the user is focused on something, like an input.
        if (active && active !== document.body) {
            return;
        }

        const action = inputToAction({ type: "keydown", event: e }, store);

        if (action) {
            action.run();
        }
    };

    const onScroll = (e: WheelEvent) => {
        const action = inputToAction({ type: "wheel", event: e }, store);

        if (action) {
            action.run();
        }
    };

    const updateDim = () => {
        if (!refCanvas.current) return;

        store.noteField.setHeight(refCanvas.current.clientHeight);
    };

    // Watch the entire store for changes so we know when to redraw.
    // NOTE: mobx only picks up on changes that happen inside actions, i.e. methods
    // on an object that has makeAutoObservable called in its constructor.
    useEffect(() => {
        const observers = [
            deepObserve(store.editor, () => redraw()),
            deepObserve(store.noteField, () => redraw()),
        ];

        return () => observers.forEach((disposer) => disposer());
    }, []);

    // Setup event listener for handling page resizes.
    useEffect(() => {
        window.addEventListener("resize", updateDim);
        return () => window.removeEventListener("resize", updateDim);
    }, []);

    // Setup event listeners for key presses and scrolling.
    useEffect(() => {
        const el = refContainer.current;

        if (!el) {
            return;
        }

        window.addEventListener("keydown", onKeyDown);
        el.addEventListener("wheel", onScroll, { passive: false });

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [refContainer]);

    // Update the dimensions once we have a reference to the element.
    useEffect(() => {
        if (!refCanvas.current) return;

        store.noteField.setCanvas(refCanvas.current);
        updateDim();
    }, [refCanvas]);

    return (
        <div className="notefield-container" ref={refContainer}>
            <div className="canvas-container">
                <Waveform store={store} />
                <canvas className="notefield" ref={refCanvas}></canvas>
                <BeatSnapDisplay store={store} />
            </div>
        </div>
    );
});
