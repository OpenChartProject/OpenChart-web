import _ from "lodash";

/**
 * Blurs the active element in the document.
 */
export const blurEverything = () => {
    (document.activeElement as HTMLElement).blur();
};

/**
 * Compares two floating point numbers and returns true if they are approximately equal.
 */
export const fuzzyEquals = (a: number, b: number): boolean => {
    return Math.abs(a - b) < 0.0005;
};

/**
 * Returns true if the string input is a valid number.
 */
export const isNumber = (val: string) => {
    if (!val) {
        return false;
    }

    return /^[-+]?\d*\.?\d*$/.test(val);
};

/**
 * Returns the value as a string with the given decimal precision. If the precision is null
 * it just returns the value as a string
 */
export const toFixed = (val: number, precision: number | null): string => {
    return precision !== null ? val.toFixed(precision) : val.toString();
};

/**
 * Like toFixed, but trims leading zeroes after the decimal place.
 *
 * e.g.  1.230 -> 1.23
 *       1.0   -> 1
 */
export const toFixedTrim = (val: number, precision: number | null): string => {
    if (precision === null || precision < 1) {
        return toFixed(val, precision);
    }

    return _.trimEnd(_.trimEnd(toFixed(val, precision), "0"), ".");
};
