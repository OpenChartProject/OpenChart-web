import { h, render } from "preact";
import { Canvas } from "./Canvas";
import { getNoteSkinSource, loadNoteSkin, NoteSkin } from "./noteskin";

loadNoteSkin(getNoteSkinSource("default_4k", 4)).then((skin) => {
    console.log(skin);

    render(
        <Canvas noteSkin={skin} keyCount={4} columnWidth={128} />,
        document.getElementById("app") as HTMLElement
    );
});
