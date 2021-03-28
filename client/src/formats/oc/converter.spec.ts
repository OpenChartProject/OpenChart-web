import assert from "assert";
import { Chart } from "../../charting/chart";
import { Project } from "../../project/project";
import { Converter } from "./converter";
import { FileData } from "./fileData";

describe("oc/Converter", () => {
    describe("#fromNative", () => {
        it("returns the expected FileData object", () => {
            const p: Project = {
                charts: [new Chart()],
                song: {
                    artist: "foo",
                    title: "bar",
                },
            };
            const expected: FileData = {
                charts: p.charts,
                metaData: {
                    version: "0.1",
                },
                song: p.song,
            };

            assert.deepStrictEqual(new Converter().fromNative(p), expected);
        });
    });

    describe("#toNative", () => {
        it("returns the expected Project object", () => {
            const data: FileData = {
                charts: [new Chart()],
                metaData: {
                    version: "0.1",
                },
                song: {
                    artist: "foo",
                    title: "bar",
                },
            };
            const expected: Project = {
                charts: data.charts,
                song: data.song,
            };

            assert.deepStrictEqual(new Converter().toNative(data), expected);
        });
    });
});
