import assert from "assert";
import _ from "lodash";

import { FileData } from "./fileData";
import { Serializer } from "./serializer";
import { BPM } from "./types";

describe("sm/serializer", () => {
    describe("#read", () => {
        it("sets default values for missing fields", () => {
            const data = new Serializer().read("");
            const expected: FileData = {
                charts: [],
                files: {
                    background: "",
                    banner: "",
                    cdTitle: "",
                },
                song: {
                    artist: "",
                    bpms: [],
                    offset: 0,
                    previewLength: 0,
                    previewStart: 0,
                    subtitle: "",
                    title: "",
                },
            };

            assert.deepStrictEqual(data, expected);
        });

        it("reads the file paths", () => {
            const input = `
            #BACKGROUND:bg;
            #BANNER:banner;
            #CDTITLE:cdtitle;
            `;
            const data = new Serializer().read(input);

            assert.strictEqual(data.files.background, "bg");
            assert.strictEqual(data.files.banner, "banner");
            assert.strictEqual(data.files.cdTitle, "cdtitle");
        });

        it("reads the song data", () => {
            const input = `
            #ARTIST:artist;
            #SUBTITLE:subtitle;
            #TITLE:title;
            #OFFSET:1.23;
            #SAMPLESTART:4.56;
            #SAMPLELENGTH:7.89;
            `;
            const data = new Serializer().read(input);

            assert.strictEqual(data.song.artist, "artist");
            assert.strictEqual(data.song.subtitle, "subtitle");
            assert.strictEqual(data.song.title, "title");
            assert.strictEqual(data.song.offset, 1.23);
            assert.strictEqual(data.song.previewStart, 4.56);
            assert.strictEqual(data.song.previewLength, 7.89);
        });

        it("reads the bpms when there's one bpm change", () => {
            const input = "#BPMS:0.000=123.456;";
            const data = new Serializer().read(input);
            const expected: BPM[] = [{ beat: 0, val: 123.456 }];

            assert.deepStrictEqual(data.song.bpms, expected);
        });

        it("reads the bpms when there's multiple bpm changes", () => {
            const input = "#BPMS:0.000=123.456,5.432=987.654;";
            const data = new Serializer().read(input);
            const expected: BPM[] = [
                { beat: 0, val: 123.456 },
                { beat: 5.432, val: 987.654 },
            ];

            assert.deepStrictEqual(data.song.bpms, expected);
        });

        it("reads the bpms when the values don't include decimals", () => {
            const input = "#BPMS:0=120;";
            const data = new Serializer().read(input);
            const expected: BPM[] = [{ beat: 0, val: 120 }];

            assert.deepStrictEqual(data.song.bpms, expected);
        });

        it("parses the chart metadata", () => {
            const input = `
            #NOTES:
                dance-single:
                foo:
                Challenge:
                1:
                :;
            `;
            const data = new Serializer().read(input);

            assert.strictEqual(data.charts.length, 1);
            assert.strictEqual(data.charts[0].type, "dance-single");
            assert.strictEqual(data.charts[0].name, "foo");
            assert.strictEqual(data.charts[0].difficulty, "Challenge");
            assert.strictEqual(data.charts[0].rating, 1);
        });

        it("parses empty note data", () => {
            const input = `
            #NOTES:
                :::::;
            `;
            const data = new Serializer().read(input);

            assert.strictEqual(data.charts.length, 1);
            assert.deepStrictEqual(data.charts[0].measures, [""]);
        });

        it("parses note data", () => {
            const input = `
            #NOTES:
                :::::
            0000
            0000
            0000
            0000
            ,
            0000
            0000
            0000
            0000
            ;
            `;
            const data = new Serializer().read(input);
            const expected = [_.repeat("0", 16), _.repeat("0", 16)];

            assert.strictEqual(data.charts.length, 1);
            assert.deepStrictEqual(data.charts[0].measures, expected);
        });

        it("parses multiple charts", () => {
            const input = `
            #NOTES:
                dance-single:
                foo:
                Challenge:
                1:
                :;
            #NOTES:
                dance-solo:
                bar:
                Hard:
                2:
                :;
            `;
            const data = new Serializer().read(input);

            assert.strictEqual(data.charts.length, 2);
            assert.strictEqual(data.charts[0].type, "dance-single");
            assert.strictEqual(data.charts[1].type, "dance-solo");
        });
    });

    describe("#writes", () => {
        it("writes file data to a string");
    });
});
