import assert from "assert";

import { Chart } from "../../charting/";
import { Project } from "../../project";

import { Converter } from "./converter";
import { FileData } from "./fileData";
import { ChartConverter } from "./types";

describe("oc/Converter", () => {
    describe("#fromNative", () => {
        it("returns the expected FileData object", () => {
            const p: Project = {
                charts: [new Chart()],
                song: {
                    artist: "foo",
                    title: "bar",
                    audioOffset: 0,
                },
            };
            const expected: FileData = {
                charts: [new ChartConverter().fromNative(p.charts[0])],
                metaData: {
                    version: "0.1",
                },
                song: {
                    artist: "foo",
                    title: "bar",
                    audioOffset: 0,
                },
            };

            assert.deepStrictEqual(new Converter().fromNative(p), expected);
        });
    });

    describe("#toNative", () => {
        it("returns the expected Project object", () => {
            const p: Project = {
                charts: [new Chart()],
                song: {
                    artist: "foo",
                    title: "bar",
                    audioOffset: 0,
                },
            };
            const fd = new Converter().fromNative(p);

            assert.deepStrictEqual(new Converter().toNative(fd), p);
        });
    });
});
