import assert from "assert";

import { Chart as NativeChart } from "../../charting";
import { Project } from "../../project";

import { Converter } from "./converter";
import { newFileData } from "./fileData";
import { BPMConverter } from "./types";
import { ChartConverter, ChartType, newChart } from "./types/chart";

describe("sm/converter", () => {
    describe("#fromNative", () => {
        it("converts the song metadata", () => {
            const p: Project = {
                charts: [],
                song: {
                    artist: "foo",
                    title: "bar",
                },
            };
            const fd = new Converter().fromNative(p);

            assert.strictEqual(fd.song.artist, p.song.artist);
            assert.strictEqual(fd.song.title, p.song.title);
        });

        it("converts the BPMs", () => {
            const p: Project = {
                charts: [new NativeChart()],
                song: {
                    artist: "",
                    title: "",
                },
            };
            const fd = new Converter().fromNative(p);

            assert.deepStrictEqual(
                p.charts[0].bpms.getAll().map((bt) => new BPMConverter().fromNative(bt.bpm)),
                fd.song.bpms,
            );
        });

        it("converts the charts", () => {
            const p: Project = {
                charts: [new NativeChart()],
                song: {
                    artist: "",
                    title: "",
                },
            };
            const fd = new Converter().fromNative(p);

            assert.deepStrictEqual(
                p.charts.map((c) => new ChartConverter().fromNative(c)),
                fd.charts,
            );
        });
    });

    describe("#toNative", () => {
        it("converts the song metadata", () => {
            const fd = newFileData();

            fd.song.artist = "foo";
            fd.song.title = "bar";

            const p = new Converter().toNative(fd);

            assert.strictEqual(p.song.artist, fd.song.artist);
            assert.strictEqual(p.song.title, fd.song.title);
        });

        it("converts the charts", () => {
            const fd = newFileData();

            fd.song.bpms = [{ beat: 0, val: 120 }];
            fd.charts = [newChart(), newChart({ type: ChartType.danceSolo })];

            const p = new Converter().toNative(fd);

            assert.deepStrictEqual(
                p.charts,
                fd.charts.map((c) => new ChartConverter(fd.song.bpms).toNative(c)),
            );
        });
    });
});
