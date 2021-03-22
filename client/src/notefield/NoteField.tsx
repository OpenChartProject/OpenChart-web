import React, { useEffect, useRef } from "react";
import { deepObserve } from "mobx-utils";
import { observer } from "mobx-react-lite";
import { drawNoteField } from "./drawing";
import { RootStore } from "../store/store";
import { inputToAction } from "./input";
import { createScrollAction, doAction } from "../store/actions";

export interface Props {
    store: RootStore;
}

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
            doAction(action, store);
        }
    }

    function onScroll(e: WheelEvent) {
        const delta = e.deltaY > 0 ? 1 : -1;
        doAction(
            createScrollAction({
                by: { time: delta * config.secondsPerScrollTick },
            }),
            store,
        );
    }

    function updateDim() {
        if (!ref.current) return;

        ref.current.height = ref.current.clientHeight;
        ref.current.width = state.width;

        const { width, height } = ref.current;
        store.setDimensions({ width, height });
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
    // NOTE: This effect runs each time the component is rendered, otherwise there is
    // an issue where the onKeyDown function references state that's stale.
    useEffect(() => {
        document.body.addEventListener("keydown", onKeyDown);
        document.body.addEventListener("wheel", onScroll);

        return () => {
            document.body.removeEventListener("keydown", onKeyDown);
            document.body.removeEventListener("wheel", onScroll);
        };
    });

    // Update the dimensions once we have a reference to the element.
    useEffect(() => {
        updateDim();
    }, [ref]);

    return <canvas ref={ref}></canvas>;
});
