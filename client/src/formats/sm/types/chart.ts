import assert from "assert";

import { Chart as NativeChart } from "../../../charting";
import { TypeConverter } from "../../converter";

export interface Chart {
    type: ChartType;
    name: string;
    difficulty: string;
    rating: number;
    measures: string[];
}

export enum ChartType {
    danceSingle = "dance-single",
    danceSolo = "dance-solo",
    danceDouble = "dance-double",
}

export const chartTypeMapping: Record<ChartType, number> = {
    "dance-single": 4,
    "dance-solo": 6,
    "dance-double": 8,
};

export const getChartTypeFromKeyCount = (keyCount: number): ChartType | undefined => {
    for (const type in chartTypeMapping) {
        if (chartTypeMapping[type as ChartType] === keyCount) {
            return type as ChartType;
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
