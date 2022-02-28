import { observer } from "mobx-react-lite";
import { deepObserve } from "mobx-utils";
import React, { useEffect, useRef } from "react";

import { drawNotefield } from "../notefield/drawing/drawing";
import { inputToAction } from "../notefield/input";
import { RootStore } from "../store";

import { BeatSnapDisplay } from "./BeatSnapDisplay";
import { BPMDisplay } from "./BPMDisplay";
import { TimePicker } from "./TimePicker";
import { Waveform } from "./Waveform";

export interface Props {
    store: RootStore;
}

/**
 * The Notefield component.
 *
 * This component doesn't do much on its own. It's mainly responsible for creating
 * a canvas element and setting up event listeners.
 *
 * This observes the store and will redraw anytime there are changes.
 *
 * It's important that changes to the store are handled using actions, otherwise the
 * changes are not broadcasted and the notefield won't redraw.
 */
export const Notefield = observer(({ store }: Props) => {
    const refCanvas = useRef<HTMLCanvasElement>(null);
    const refContainer = useRef<HTMLDivElement>(null);

    const redraw = () => {
        if (!refCanvas.current) return;

        drawNotefield(store);
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

        store.notefield.setHeight(refCanvas.current.clientHeight);
    };

    // Watch the entire store for changes so we know when to redraw.
    // NOTE: mobx only picks up on changes that happen inside actions, i.e. methods
    // on an object that has makeAutoObservable called in its constructor.
    useEffect(() => {
        const observers = [
            deepObserve(store.notefieldDisplay, () => redraw()),
            deepObserve(store.notefield, () => redraw()),
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

        store.notefield.setCanvas(refCanvas.current);
        updateDim();
    }, [refCanvas]);

    let className = "notefield-container";

    if (store.notefieldDisplay.data.scrollDirection === "up") {
        className += " upscroll";
    } else {
        className += " downscroll";
    }

    return (
        <div className={className} ref={refContainer}>
            <div className="canvas-container">
                {store.ui.tools.timePicker.active && <TimePicker store={store} />}

                <BeatSnapDisplay store={store} />
                <BPMDisplay store={store} />
                <Waveform store={store} />

                <canvas className="notefield" ref={refCanvas}></canvas>
            </div>
        </div>
    );
});
