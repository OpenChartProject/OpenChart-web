import Fraction from "fraction.js";

import { Beat as NativeBeat } from "../../../charting/";

import { TypeConverter } from "./typeConverter";

export interface Beat {
    f: string;
    val: number;
}

export class BeatConverter implements TypeConverter<NativeBeat, Beat> {
    toNative(data: Beat): NativeBeat {
        return new NativeBeat(new Fraction(data.f));
    }

    fromNative(data: NativeBeat): Beat {
        return {
            f: data.fraction.toFraction(),
            val: data.value,
        };
    }
}
