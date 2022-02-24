import assert from "assert";

import { Chart as NativeChart } from "../../../charting";
import { TypeConverter } from "../../converter";

import { BPM, BPMConverter } from "./bpm";
import { NoteData, NoteDataConverter } from "./noteData";

export interface Chart {
    type: ChartType;
    name: string;
    difficulty: string;
    rating: number;
    notes: NoteData;
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

export interface NewChartOpts {
    notes?: NoteData;
    type?: ChartType;
}

export const newChart = ({ type, notes }: NewChartOpts = {}): Chart => {
    return {
        difficulty: "",
        notes: notes ?? [],
        name: "",
        rating: 1,
        type: type ?? ChartType.danceSingle,
    };
};

export class ChartConverter implements TypeConverter<NativeChart, Chart> {
    /**
     * The BPM changes from the .sm file. This is needed when converting the chart
     * to a native chart.
     */
    private bpms: BPM[];

    constructor(bpms?: BPM[]) {
        this.bpms = bpms ?? [{ beat: 0, val: 120 }];
    }

    toNative(data: Chart): NativeChart {
        const keyCount = chartTypeMapping[data.type];
        assert(keyCount !== undefined, `unrecognized chart type "${data.type}"`);

        const chart = new NativeChart({
            bpms: this.bpms.map((bpm) => new BPMConverter().toNative(bpm)),
            keyCount,
            objects: new NoteDataConverter(keyCount).toNative(data.notes),
        });

        return chart;
    }

    fromNative(data: NativeChart): Chart {
        const type = getChartTypeFromKeyCount(data.keyCount.value);
        assert(type, `.sm does not support charts with ${data.keyCount.value} keys`);

        const notes = new NoteDataConverter(data.keyCount.value).fromNative(data.objects);
        const chart = newChart({ notes, type });

        return chart;
    }
}
