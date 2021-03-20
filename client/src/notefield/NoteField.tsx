import { h } from "preact";
import { useEffect, useRef, Ref, useState } from "preact/hooks";
import { drawNoteField } from "./drawing";
import { NoteFieldConfig, NoteFieldState } from "./config";
import { Beat, BeatTime } from "../charting/beat";
import { Time } from "../charting/time";
import { Tap } from "../charting/objects/tap";

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

    function scrollTo({ beat, time }: Partial<BeatTime>) {
        if (beat !== undefined) {
            time = props.chart.bpms.timeAt(beat);
            setScroll({ beat, time });
        } else if (time !== undefined) {
            beat = props.chart.bpms.beatAt(time);
            setScroll({ beat, time });
        } else {
            throw Error("beat or time must be set");
        }
    }

    function scrollBy({ beat, time }: { beat?: number; time?: number }) {
        if (beat !== undefined) {
            scrollTo({ beat: new Beat(Math.max(beat + scroll.beat.value, 0)) });
        } else if (time !== undefined) {
            scrollTo({ time: new Time(Math.max(time + scroll.time.value, 0)) });
        } else {
            throw Error("beat or time must be set");
        }
    }

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
        let key = 0;

        switch (e.key) {
            case "1":
                if (e.repeat) return;
                key = 0;
                break;
            case "2":
                if (e.repeat) return;
                key = 1;
                break;
            case "3":
                if (e.repeat) return;
                key = 2;
                break;
            case "4":
                if (e.repeat) return;
                key = 3;
                break;
            case "ArrowUp":
                e.preventDefault();
                scrollBy({ time: -1 * props.secondsPerScrollTick });
                return;
            case "ArrowDown":
                e.preventDefault();
                scrollBy({ time: 1 * props.secondsPerScrollTick });
                return;
            default:
                return;
        }

        const c = props.chart;
        const opts = { removeIfExists: true };
        const modified = c.placeObject(new Tap(scroll.beat, key), opts);

        if (modified) {
            redraw();
        }
    }

    function onScroll(e: WheelEvent) {
        const delta = e.deltaY > 0 ? 1 : -1;
        scrollBy({ time: delta * props.secondsPerScrollTick });
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
    });

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
