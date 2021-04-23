import { Tap as NativeTap } from "../../../charting/objects/";
import { TypeConverter } from "../../converter";

import { BeatConverter } from "./beat";
import { ChartObject } from "./chartObject";

export interface Tap extends ChartObject {
    type: "tap";
}

export class TapConverter implements TypeConverter<NativeTap, Tap> {
    toNative(data: Tap): NativeTap {
        return new NativeTap(new BeatConverter().toNative(data.beat), data.key);
    }

    fromNative(data: NativeTap): Tap {
        return {
            beat: new BeatConverter().fromNative(data.beat),
            key: data.key.value,
            type: "tap",
        };
    }
}
