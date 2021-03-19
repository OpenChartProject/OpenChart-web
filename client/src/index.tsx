import { h, render } from "preact";
import { Beat } from "./charting/beat";
import { Chart } from "./charting/chart";
import { KeyIndex } from "./charting/keyIndex";
import { Tap } from "./charting/objects/tap";
import { NoteFieldConfig } from "./notefield/config";
import { NoteField } from "./notefield/NoteField";
import { getNoteSkinSource, loadNoteSkin } from "./noteskin";

const chart = new Chart();
chart.objects[0].push(new Tap(new Beat(0), new KeyIndex(0)));
chart.objects[1].push(new Tap(new Beat(1), new KeyIndex(1)));
chart.objects[2].push(new Tap(new Beat(2), new KeyIndex(2)));
chart.objects[3].push(new Tap(new Beat(3), new KeyIndex(3)));

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
        secondsPerScrollTick: 0.1,
    };

    render(
        <NoteField {...config} />,
        document.getElementById("app") as HTMLElement,
    );
});
