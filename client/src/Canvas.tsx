import { h } from "preact";
import { useEffect, useRef, Ref, useState } from "preact/hooks";
import { NoteSkin } from "./noteskin";

export interface Props {
    noteSkin?: NoteSkin;
}

export function Canvas(props: Props) {
    const ref: Ref<HTMLCanvasElement | null> = useRef(null);
    const [dim, setDim] = useState({ width: 0, height: 0 });

    function updateDim() {
        if (!ref.current) return;

        setDim({
            height: ref.current?.clientHeight,
            width: ref.current?.clientWidth,
        });
    }

    // Resize the canvas after it's created.
    useEffect(updateDim, [ref]);

    // Setup the resize event listener.
    useEffect(() => {
        window.addEventListener("resize", updateDim);
        return () => window.removeEventListener("resize", updateDim);
    });

    // Update the canvas draw dimensions.
    useEffect(() => {
        if (!ref.current) return;

        ref.current.height = dim.height;
        ref.current.width = dim.width;
    }, [dim, ref]);

    // Redraw when the dimensions change.
    useEffect(() => {
        if (!ref.current) return;

        const ctx = ref.current.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, dim.width, dim.height);

        if (props.noteSkin) {
            ctx.drawImage(props.noteSkin.receptor[0], 0, 0);
        }

        console.log("redraw");
    }, [dim]);

    return <canvas ref={ref}></canvas>;
}
