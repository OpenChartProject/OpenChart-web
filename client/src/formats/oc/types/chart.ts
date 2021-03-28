import { BPM, BPMConverter } from "./bpm";
import { Tap as NativeTap } from "../../../charting/objects/tap";
import { Chart as NativeChart } from "../../../charting/chart";
import { TypeConverter } from "./typeConverter";
import { ChartObject } from "./chartObject";
import { Tap, TapConverter } from "./tap";

export interface Chart {
    bpms: BPM[];
    keyCount: number;
    objects: ChartObject[][];
}

export class ChartConverter implements TypeConverter<NativeChart, Chart> {
    toNative(data: Chart): NativeChart {
        const c = new NativeChart({ keyCount: data.keyCount });

        c.bpms.setBPMs(data.bpms.map((bpm) => new BPMConverter().toNative(bpm)));

        for (let i = 0; i < data.keyCount; i++) {
            for (const obj of data.objects[i]) {
                if (obj.type === "tap") {
                    c.placeObject(new TapConverter().toNative(obj as Tap));
                } else if (obj.type === "hold") {
                    // TODO
                }
            }
        }

        return c;
    }

    fromNative(data: NativeChart): Chart {
        return {
            bpms: data.bpms.getBPMS().map((bpm) => new BPMConverter().fromNative(bpm.bpm)),
            keyCount: data.keyCount.value,
            objects: data.objects.map((keyObjects) => {
                return keyObjects.map((obj) => {
                    if (obj.type === "tap") {
                        return new TapConverter().fromNative(obj as NativeTap);
                    } else if (obj.type === "hold") {
                        // TODO
                    }
                });
            }),
        };
    }
}
