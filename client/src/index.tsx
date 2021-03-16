import { h, render } from "preact";
import { Beat } from "./charting/beat";
import { BPM } from "./charting/bpm";
import { Chart } from "./charting/chart";
import { NoteFieldConfig } from "./notefield/config";
import { NoteField } from "./notefield/NoteField";
import { getNoteSkinSource, loadNoteSkin } from "./noteskin";

const chart = new Chart();
chart.bpms.bpms.push(new BPM(Beat.Zero, 120));

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
    };

    render(
        <NoteField {...config} />,
        document.getElementById("app") as HTMLElement
    );
});
