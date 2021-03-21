import React, { useEffect, useRef } from "react";
import { deepObserve } from "mobx-utils";
import { observer } from "mobx-react-lite";
import { drawNoteField } from "./drawing";
import { Tap } from "../charting/objects/tap";
import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const NoteField = observer(({ store }: Props) => {
    const { config, state } = store;
    const ref = useRef<HTMLCanvasElement>(null);

    function redraw() {
        if (!ref.current) return;

        console.log(Date.now());
        drawNoteField(ref.current, { ...config, ...state });
    }

    function onKeyDown(e: KeyboardEvent) {
        let key = 0;

        switch (e.key) {
            case config.keyBinds.keys[4][0]:
                if (e.repeat) return;
                key = 0;
                break;
            case config.keyBinds.keys[4][1]:
                if (e.repeat) return;
                key = 1;
                break;
            case config.keyBinds.keys[4][2]:
                if (e.repeat) return;
                key = 2;
                break;
            case config.keyBinds.keys[4][3]:
                if (e.repeat) return;
                key = 3;
                break;
            case config.keyBinds.scroll.up:
                e.preventDefault();
                store.scrollBy({ time: -1 * config.secondsPerScrollTick });
                return;
            case config.keyBinds.scroll.down:
                e.preventDefault();
                store.scrollBy({ time: 1 * config.secondsPerScrollTick });
                return;
            default:
                return;
        }

        const c = config.chart;
        const opts = { removeIfExists: true };
        c.placeObject(new Tap(state.scroll.beat, key), opts);
    }

    function onScroll(e: WheelEvent) {
        const delta = e.deltaY > 0 ? 1 : -1;
        store.scrollBy({ time: delta * config.secondsPerScrollTick });
    }

    function updateDim() {
        if (!ref.current) return;

        ref.current.height = ref.current.clientHeight;
        ref.current.width = state.width;

        const { width, height } = ref.current;
        store.setDimensions({ width, height });
    }

    // Watch the entire store for changes so we know when to redraw.
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
