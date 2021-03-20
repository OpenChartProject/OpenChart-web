import { h } from "preact";
import { useEffect, useRef, Ref, useState } from "preact/hooks";
import { drawNoteField } from "./drawing";
import { NoteFieldConfig, NoteFieldState } from "./config";
import { Beat, BeatTime } from "../charting/beat";
import { Time } from "../charting/time";
import { Tap } from "../charting/objects/tap";
import { toBeatTime } from "../charting/util";

export type Props = NoteFieldConfig;

export function NoteField(props: Props) {
    const ref: Ref<HTMLCanvasElement | null> = useRef(null);
    const [dim, setDim] = useState({
        width: props.keyCount * props.columnWidth,
        height: 0,
    });
    const [scroll, setScroll] = useState<BeatTime>({
        beat: Beat.Zero,
        time: Time.Zero,
    });

    function redraw() {
        if (!ref.current) return;

        const drawState: NoteFieldState = {
            width: dim.width,
            height: dim.height,
            scroll,
        };

        drawNoteField(ref.current, { ...props, ...drawState });
    }

    function onKeyDown(e: KeyboardEvent) {
        if(e.repeat) {
            return;
        }

        const c = props.chart;
        const opts = { removeIfExists: true };
        let key = 0;

        switch (e.key) {
            case "1":
                key = 0;
                break;
            case "2":
                key = 1;
                break;
            case "3":
                key = 2;
                break;
            case "4":
                key = 3;
                break;
            default:
                return;
        }

        e.preventDefault();

        const modified = c.placeObject(new Tap(scroll.beat, key), opts);

        if (modified) {
            redraw();
        }
    }

    function onScroll(e: WheelEvent) {
        setScroll((prev) => {
            const delta = e.deltaY > 0 ? 1 : -1;
            const time = Math.max(
                prev.time.value + delta * props.secondsPerScrollTick,
                0,
            );
            return toBeatTime(props.chart.bpms.beatAt(time), time);
        });
    }

    function updateDim() {
        setDim({
            height: ref.current!.clientHeight,
            width: dim.width,
        });
    }

    // Resize the canvas after it's created.
    useEffect(() => {
        if (!ref.current) return;
        updateDim();
    }, [ref]);

    // Setup event listener for handling page resizes.
    useEffect(() => {
        window.addEventListener("resize", updateDim);
        return () => window.removeEventListener("resize", updateDim);
    }, []);

    // Setup event listener for handling mouse wheel events.
    useEffect(() => {
        document.body.addEventListener("wheel", onScroll);
        return () => document.body.removeEventListener("wheel", onScroll);
    }, []);

    // Setup the keyboard listener.
    // NOTE: This effect runs each time the component is rendered, otherwise there is
    // an issue where the onKeyDown function references state that's stale.
    useEffect(() => {
        document.body.addEventListener("keydown", onKeyDown);
        return () => document.body.removeEventListener("keydown", onKeyDown);
    });

    // Update the canvas draw dimensions to match the size of the canvas element.
    useEffect(() => {
        if (!ref.current) return;

        ref.current.height = dim.height;
        ref.current.width = dim.width;
    }, [dim, ref]);

    // Redraw when the dimensions change.
    useEffect(() => {
        redraw();
    }, [dim, scroll]);

    return <canvas ref={ref}></canvas>;
}
