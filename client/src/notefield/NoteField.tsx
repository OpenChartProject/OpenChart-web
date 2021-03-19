import { h } from "preact";
import { useEffect, useRef, Ref, useState } from "preact/hooks";
import { drawNoteField } from "./drawing";
import { NoteFieldConfig, NoteFieldState } from "./config";

export type Props = NoteFieldConfig;

export function NoteField(props: Props) {
    const ref: Ref<HTMLCanvasElement | null> = useRef(null);
    const [dim, setDim] = useState({
        width: props.keyCount * props.columnWidth,
        height: 0,
    });
    const [scroll, setScroll] = useState(0);

    function onScroll(e: WheelEvent) {
        console.log(e);
        setScroll((prev) => Math.max(prev + e.deltaY, 0));
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
        ref.current.addEventListener("wheel", onScroll);
    }, [ref]);

    // Setup the resize event listener.
    useEffect(() => {
        window.addEventListener("resize", updateDim);
        return () => window.removeEventListener("resize", updateDim);
    });

    // Update the canvas draw dimensions to match the size of the canvas element.
    useEffect(() => {
        if (!ref.current) return;

        ref.current.height = dim.height;
        ref.current.width = dim.width;
    }, [dim, ref]);

    // Redraw when the dimensions change.
    useEffect(() => {
        if (!ref.current) return;

        const drawState: NoteFieldState = {
            width: dim.width,
            height: dim.height,
            scroll,
        };

        drawNoteField(ref.current, { ...props, ...drawState });
    }, [dim, scroll]);

    return <canvas ref={ref}></canvas>;
}
