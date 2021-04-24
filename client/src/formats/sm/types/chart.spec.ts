import assert from "assert";

import { ChartType, getChartTypeFromKeyCount } from "./chart";

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
        describe("#toNative", () => {});

        describe("#fromNative", () => {});
    });
});
