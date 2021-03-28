import { BPM } from "./bpm";
import { Chart as NativeChart } from "../../../charting/chart";
import { TypeConverter } from "./typeConverter";

export interface Chart {
    bpms: BPM[];
    keyCount: number;
}

export class ChartConverter implements TypeConverter<NativeChart, Chart> {
    toNative(data: Chart): NativeChart {
        throw new Error("Method not implemented.");
    }

    fromNative(data: NativeChart): Chart {
        throw new Error("Method not implemented.");
    }
}
