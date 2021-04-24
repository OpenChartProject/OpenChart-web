import { TypeConverter } from "../../converter";

import { Chart as NativeChart } from "../../../charting";
import assert from "assert";

export interface Chart {
    type: string;
    name: string;
    difficulty: string;
    rating: number;
    measures: string[];
}

export const chartTypeMapping: Record<string, number> = {
    "dance-single": 4,
    "dance-solo": 6,
    "dance-double": 8,
};

export const getChartTypeFromKeyCount = (keyCount: number): string | undefined => {
    for (const type in chartTypeMapping) {
        if (chartTypeMapping[type] === keyCount) {
            return type;
        }
    }

    return undefined;
};

export class ChartConverter implements TypeConverter<NativeChart, Chart> {
    toNative(data: Chart): NativeChart {
        const keyCount = chartTypeMapping[data.type];
        assert(keyCount !== undefined, `unrecognized chart type "${data.type}"`);

        const chart = new NativeChart({ keyCount });

        return chart;
    }

    fromNative(data: NativeChart): Chart {
        const chartType = getChartTypeFromKeyCount(data.keyCount.value);

        assert(chartType, `.sm does not support charts with ${data.keyCount.value} keys`);

        const chart: Chart = {
            difficulty: "",
            measures: [],
            name: "",
            rating: 1,
            type: chartType,
        };

        return chart;
    }
}
