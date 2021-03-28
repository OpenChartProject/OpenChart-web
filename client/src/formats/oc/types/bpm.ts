import { BPM as NativeBPM } from "../../../charting/bpm";
import { Beat, BeatConverter } from "./beat";
import { TypeConverter } from "./typeConverter";

export interface BPM {
    beat: Beat;
    val: number;
}

export class BPMConverter implements TypeConverter<NativeBPM, BPM> {
    toNative(data: BPM): NativeBPM {
        return new NativeBPM(new BeatConverter().toNative(data.beat), data.val);
    }

    fromNative(data: NativeBPM): BPM {
        return {
            beat: new BeatConverter().fromNative(data.beat),
            val: data.value,
        };
    }
}
