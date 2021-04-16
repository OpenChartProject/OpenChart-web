/**
 * Blurs the active element in the document.
 */
export const blurEverything = () => {
    (document.activeElement as HTMLElement).blur();
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
