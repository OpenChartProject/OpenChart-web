import assert from "assert";

import { BPM, FileData } from "./fileData";
import { Serializer } from "./serializer";

describe("sm/serializer", () => {
    describe("#read", () => {
        it("sets default values for missing fields", () => {
            const data = new Serializer().read("");
            const expected: FileData = {
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
            const expected: BPM[] = [{ beat: 0, value: 123.456 }];

            assert.deepStrictEqual(data.song.bpms, expected);
        });

        it("reads the bpms when there's multiple bpm changes", () => {
            const input = "#BPMS:0.000=123.456,5.432=987.654;";
            const data = new Serializer().read(input);
            const expected: BPM[] = [
                { beat: 0, value: 123.456 },
                { beat: 5.432, value: 987.654 },
            ];

            assert.deepStrictEqual(data.song.bpms, expected);
        });

        it("reads the bpms when the values don't include decimals", () => {
            const input = "#BPMS:0=120;";
            const data = new Serializer().read(input);
            const expected: BPM[] = [{ beat: 0, value: 120 }];

            assert.deepStrictEqual(data.song.bpms, expected);
        });
    });

    describe("#writes", () => {
        it("writes file data to a string");
    });
});
