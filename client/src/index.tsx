import { h, render } from "preact";
import { Canvas } from "./Canvas";
import { getNoteSkinSource, loadNoteSkin, NoteSkin } from "./noteskin";

loadNoteSkin(getNoteSkinSource("default_4k", 4)).then((skin) => {
    console.log(skin);

    render(
        <Canvas noteSkin={skin} />,
        document.getElementById("app") as HTMLElement
    );
});
