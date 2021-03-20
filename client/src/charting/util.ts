import { Beat } from "./beat";
import { KeyCount } from "./keyCount";
import { KeyIndex } from "./keyIndex";
import { Time } from "./time";

/**
 * Converts val to a Beat if it isn't one already.
 */
export function toBeat(val: Beat | number): Beat {
    if (typeof val === "number") {
        return new Beat(val);
    }

    return val;
}

/**
 * Converts val to a KeyCount if it isn't one already.
 */
export function toKeyCount(val: KeyCount | number): KeyCount {
    if (typeof val === "number") {
        return new KeyCount(val);
    }

    return val;
}

/**
 * Converts val to a KeyIndex if it isn't one already.
 */
export function toKeyIndex(val: KeyIndex | number): KeyIndex {
    if (typeof val === "number") {
        return new KeyIndex(val);
    }

    return val;
}

/**
 * Converts val to a Time if it isn't one already.
 */
export function toTime(val: Time | number): Time {
    if (typeof val === "number") {
        return new Time(val);
    }

    return val;
}
