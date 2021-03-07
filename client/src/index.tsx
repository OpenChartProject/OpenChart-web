import { h, render } from "preact";
import { Canvas } from "./Canvas";
import { getNoteSkinSource, loadNoteSkin } from "./noteskin";

const src = getNoteSkinSource("default_4k", 4);
console.log("Loading noteskin...");
const ns = loadNoteSkin(src);
ns.then(() => console.log("done loading", ns));

render(<Canvas />, document.getElementById("app") as HTMLElement);
