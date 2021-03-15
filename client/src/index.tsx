import { h, render } from "preact";
import { Canvas } from "./Canvas";
import { getNoteSkinSource, loadNoteSkin, NoteSkin } from "./noteskin";

let ns: NoteSkin;

loadNoteSkin(getNoteSkinSource("default_4k", 4)).then(
    (result) => (ns = result)
);

render(
    <Canvas noteSkin={ns!} />,
    document.getElementById("app") as HTMLElement
);
