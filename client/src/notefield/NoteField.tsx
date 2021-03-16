import { h } from "preact";
import { useEffect, useRef, Ref, useState } from "preact/hooks";
import { drawNoteField } from "./drawing";
import { NoteFieldConfig } from "./config";

export interface Props extends NoteFieldConfig { };

export function NoteField(props: Props) {
    const ref: Ref<HTMLCanvasElement | null> = useRef(null);
    const [dim, setDim] = useState({ width: props.keyCount * props.columnWidth, height: 0 });

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

        drawNoteField(ref.current, props);
    }, [dim]);

    return <canvas ref={ref}></canvas>;
}
