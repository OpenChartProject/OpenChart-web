import assert from "assert";

import { Chart } from "../../../charting";

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
                const chart = newChart("foo" as ChartType);

                assert.throws(() => {
                    new ChartConverter().toNative(chart);
                });
            });

            it("converts the chart type to the correct key count", () => {
                for (const type in chartTypeMapping) {
                    const chart = newChart(type as ChartType);
                    const native = new ChartConverter().toNative(chart);

                    const expected = chartTypeMapping[type as ChartType];

                    assert.strictEqual(native.keyCount.value, expected);
                }
            });
        });

        describe("#fromNative", () => {
            it("throws if the key count is not supported", () => {
                const native = new Chart({ keyCount: 5 });

                assert.throws(() => {
                    new ChartConverter().fromNative(native);
                });
            });

            it("converts the key count to the correct chart type", () => {
                for (const type in chartTypeMapping) {
                    const native = new Chart({ keyCount: chartTypeMapping[type as ChartType] });
                    const chart = new ChartConverter().fromNative(native);

                    const expected = type;

                    assert.strictEqual(chart.type, expected);
                }
            });
        });
    });
});
