import { BPM as NativeBPM } from "../../../charting/";
import { TypeConverter } from "../../converter";

export interface BPM {
    beat: number;
    val: number;
}

export class BPMConverter implements TypeConverter<NativeBPM, BPM> {
    toNative(data: BPM): NativeBPM {
        return new NativeBPM(data.beat, data.val);
    }

    fromNative(data: NativeBPM): BPM {
        return {
            beat: data.beat.value,
            val: data.value,
        };
    }
}
