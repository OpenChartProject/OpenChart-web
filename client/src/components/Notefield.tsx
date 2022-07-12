import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import { deepObserve } from "mobx-utils";
import React, { useEffect, useRef } from "react";

import { NotefieldContext } from "../notefield/context";
import { getNotefieldDrawData } from "../notefield/drawing/drawData";
import { drawNotefield } from "../notefield/drawing/drawing";
import { calculateViewport } from "../notefield/drawing/viewport";
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

    const processNotefieldChanges = () => {
        if (!store.notefieldDisplay.data.noteSkin) {
            console.warn("Skipping redraw: no noteskin is set");
            return;
        }

        const context: NotefieldContext = {
            chart: store.notefield.data.chart,
            w: store.notefield.data.width,
            h: store.notefield.data.height,
            noteSkin: store.notefieldDisplay.data.noteSkin,
            notefield: store.notefield,
            notefieldDisplay: store.notefieldDisplay,
            viewport: calculateViewport(store.notefieldDisplay, store.notefield),
        };

        store.notefield.setContext(context);
        store.notefield.setDrawData(getNotefieldDrawData(context));
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

    const onMouseDown = (e: MouseEvent) => {
        const inCanvas = e.target === refCanvas.current;
        const action = inputToAction({ type: "mousedown", event: e, inCanvas }, store);

        if (action) {
            action.run();
        }
    };

    const onMouseUp = (e: MouseEvent) => {
        const inCanvas = e.target === refCanvas.current;
        const action = inputToAction({ type: "mouseup", event: e, inCanvas }, store);

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
            deepObserve(store.notefieldDisplay, () => processNotefieldChanges()),

            // NOTE: It's *really* important that we listen to just the data and not the
            // entire store. Redrawing updates other fields on the store which leads to
            // infinite recursion if we also listen to those.
            deepObserve(store.notefield.data, () => processNotefieldChanges()),
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

        // Key presses are emitted from the window, unless the user is focussed on an input
        window.addEventListener("keydown", onKeyDown);
        el.addEventListener("mousedown", onMouseDown);
        el.addEventListener("mouseup", onMouseUp);
        el.addEventListener("wheel", onScroll, { passive: false });

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [refContainer]);

    // Update the dimensions once we have a reference to the element.
    useEffect(() => {
        if (!refCanvas.current) return;

        store.notefield.setCanvas(refCanvas.current);
        updateDim();
    }, [refCanvas]);

    // Handles the actual redrawing of the notefield canvas. This uses `autorun` since the
    // state we are reacting to is not local state from a `useState()` hook.
    // See the "useEffect and observables" tip: https://mobx.js.org/react-integration.html
    useEffect(() => {
        return autorun(() => {
            const { ctx, drawData } = store.notefield;

            if (!ctx || !drawData) {
                console.warn("Skipping redraw: missing draw data or context");
                return;
            } else if (!refCanvas.current) {
                console.warn("Skipping redraw: canvas ref is null");
                return;
            }

            drawNotefield(refCanvas.current, ctx, drawData);
        });
    }, []);

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
