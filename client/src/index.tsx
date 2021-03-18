import { h, render } from "preact";
import { Chart } from "./charting/chart";
import { NoteFieldConfig } from "./notefield/config";
import { NoteField } from "./notefield/NoteField";
import { getNoteSkinSource, loadNoteSkin } from "./noteskin";

const chart = new Chart();

loadNoteSkin(getNoteSkinSource("default_4k", 4)).then((skin) => {
    console.log(skin);
    const config: NoteFieldConfig = {
        colors: {
            background: "#000",
            beatLines: "#AAA",
        },
        chart,
        columnWidth: 128,
        keyCount: 4,
        noteSkin: skin,
        pixelsPerSecond: 400,
        secondsPerScrollTick: 0.25,
    };

    render(
        <NoteField {...config} />,
        document.getElementById("app") as HTMLElement,
    );
});
