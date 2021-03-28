import { Hold as NativeHold } from "../../../charting/objects/";

import { Beat, BeatConverter } from "./beat";
import { ChartObject } from "./chartObject";
import { TypeConverter } from "./typeConverter";

export interface Hold extends ChartObject {
    duration: Beat;
    type: "hold";
}

export class HoldConverter implements TypeConverter<NativeHold, Hold> {
    toNative(data: Hold): NativeHold {
        return new NativeHold(
            new BeatConverter().toNative(data.beat),
            new BeatConverter().toNative(data.duration),
            data.key,
        );
    }

    fromNative(data: NativeHold): Hold {
        return {
            beat: new BeatConverter().fromNative(data.beat),
            duration: new BeatConverter().fromNative(data.duration),
            key: data.key.value,
            type: "hold",
        };
    }
}
