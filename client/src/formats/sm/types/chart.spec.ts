import assert from "assert";

import { Chart as NativeChart } from "../../../charting";
import { Tap } from "../../../charting/objects";

import { BPM, BPMConverter } from "./bpm";
import {
    ChartConverter,
    ChartType,
    chartTypeMapping,
    getChartTypeFromKeyCount,
    newChart,
} from "./chart";

describe("sm/types", () => {
    describe("#getChartTypeFromKeyCount", () => {
        it("returns the expected value for valid key counts", () => {
            assert.strictEqual(getChartTypeFromKeyCount(4), ChartType.danceSingle);
            assert.strictEqual(getChartTypeFromKeyCount(6), ChartType.danceSolo);
            assert.strictEqual(getChartTypeFromKeyCount(8), ChartType.danceDouble);
        });

        it("returns undefined for unsupported key counts", () => {
            assert.strictEqual(getChartTypeFromKeyCount(1), undefined);
            assert.strictEqual(getChartTypeFromKeyCount(5), undefined);
            assert.strictEqual(getChartTypeFromKeyCount(7), undefined);
        });
    });

    describe("ChartConverter", () => {
        describe("#toNative", () => {
            it("throws if the chart type is not recognized", () => {
                const chart = newChart({ type: "foo" as ChartType });

                assert.throws(() => {
                    new ChartConverter().toNative(chart);
                });
            });

            it("converts the chart type to the correct key count", () => {
                for (const type in chartTypeMapping) {
                    const chart = newChart({ type: type as ChartType });
                    const native = new ChartConverter().toNative(chart);

                    const expected = chartTypeMapping[type as ChartType];

                    assert.strictEqual(native.keyCount.value, expected);
                }
            });

            it("converts the BPM changes", () => {
                const bpms: BPM[] = [
                    { beat: 0, val: 120 },
                    { beat: 4, val: 180 },
                ];
                const chart = newChart();
                const native = new ChartConverter(bpms).toNative(chart);

                const expected = bpms.map((bpm) => new BPMConverter().toNative(bpm));

                assert.deepStrictEqual(
                    native.bpms.getAll().map((bt) => bt.bpm),
                    expected,
                );
            });

            it("converts the note data", () => {
                const noteData = ["1000", "0100", "0010", "0001"].join("");
                const chart = newChart();
                chart.notes = [noteData];
                const native = new ChartConverter().toNative(chart);

                const expected = [
                    [new Tap(0, 0)],
                    [new Tap(0.25, 1)],
                    [new Tap(0.5, 2)],
                    [new Tap(0.75, 3)],
                ];

                assert.deepStrictEqual(native.objects, expected);
            });
        });

        describe("#fromNative", () => {
            it("throws if the key count is not supported", () => {
                const native = new NativeChart({ keyCount: 5 });

                assert.throws(() => {
                    new ChartConverter().fromNative(native);
                });
            });

            it("converts the key count to the correct chart type", () => {
                for (const type in chartTypeMapping) {
                    const native = new NativeChart({
                        keyCount: chartTypeMapping[type as ChartType],
                    });
                    const chart = new ChartConverter().fromNative(native);

                    const expected = type;

                    assert.strictEqual(chart.type, expected);
                }
            });
        });
    });
});
