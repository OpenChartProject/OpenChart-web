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
