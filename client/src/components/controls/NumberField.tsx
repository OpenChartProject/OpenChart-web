import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import { isNumber, toFixed, toFixedTrim } from "../../util";

export interface Props {
    /**
     * The increment/decrement amount when the user presses up/down arrow. If the delta
     * is 0 or not set then this is disabled.
     */
    delta?: number;

    /**
     * Whether the input is disabled or not.
     */
    disabled?: boolean;

    /**
     * Whether the input is inline or not (affects className).
     */
    inline?: boolean;

    /**
     * The decimal precision to use when formatting the input.
     */
    precision?: number;

    /**
     * The field text. This is handled outside of the component to allow for modifying
     * the input as needed.
     */
    text: string;

    /**
     * When true, this trims any leading zeroes after the decimal place.
     */
    trim?: boolean;

    /**
     * The value associated with the field. This is used as a fallback for when the user
     * deletes the input, as well as updating the input if the value changed externally.
     *
     * Typically, you'll use the onSubmit or onValueChange callbacks to receive the number
     * value from the component, do whatever you need to do with the value, and then feed
     * that value back into this prop.
     */
    value: number;

    /**
     * Callback for when the text input has changed.
     */
    onChange(text: string): void;

    /**
     * Callback for when the value has changed but the user has not committed the change.
     *
     * This is useful for tracking if the field's value was changed.
     */
    onValueChange?(val: number): void;

    /**
     * Callback for when the value has changed and the user has committed the change,
     * either by pressing enter or blurring the field.
     *
     * This is not called if the user entered something that's not a number.
     *
     * If this returns false, that's interpreted to mean the change was rejected. In that
     * case, if the user had pressed enter to submit the form, the enter keypress stops
     * propagating to prevent the outer form from submitting.
     */
    onSubmit?(val: number): boolean | void;
}

/**
 * NumberField is a text input field for numbers.
 *
 * Behavior:
 *  - Calls the onChanged prop only when the user is done editing the field
 *     - Triggered by onBlur and when the user presses Enter
 *  - Formats the input up to precision decimal places (if provided)
 *  - Overwrites the input value when the value prop changes
 *  - Increments/decrements by delta prop using up/down arrow (if provided)
 *  - Resets the field to the value prop if the user leaves the field empty
 *
 * Suggested usage:
 *  - Update the value prop when onChanged is triggered
 *  - Wrap this component in a form with an onSubmit callback
 *     - On submit, call e.preventDefault() and blurEverything()
 */
export const NumberField = observer((props: Props) => {
    const { delta, disabled, value, inline, text } = props;
    const precision = props.precision ?? null;

    let inputValue = isNumber(text) ? _.toNumber(text) : null;
    const formatValue = props.trim ? toFixedTrim : toFixed;

    // Call onValueChange when the input value has changed
    useEffect(() => {
        if (inputValue !== null && props.onValueChange) {
            props.onValueChange(inputValue);
        }
    }, [inputValue]);

    // Replace the input value when the value prop changes
    useEffect(() => {
        props.onChange(formatValue(value, precision));
    }, [value]);

    // This is called once the user is done editing the field. Pressing enter and blurring
    // both trigger postChanges.
    //
    // This returns true when the number value of the field has changed, false otherwise.
    // If the user pressed enter but the number value stayed the same, this function returns
    // false, and the enter keypress is swallowed to prevent form submissions.
    const postChanges = (): boolean => {
        // Reset the input if it's empty or invalid
        if (text.trim() === "" || inputValue === null) {
            props.onChange(formatValue(value, precision));
            return false;
        }

        const formatted = formatValue(inputValue, precision);

        // Don't broadcast a change if the input is the same
        if (formatted === text) {
            return false;
        }

        props.onChange(formatted);

        if (props.onSubmit) {
            return props.onSubmit(inputValue) !== false;
        }

        return true;
    };

    // Enter posts the changes
    // Up arrow increments by delta and posts the changes
    // Down arrow increments by delta and posts the changes
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            // Prevent the keypress from propagating if the value isn't valid, or was rejected
            // by the onSubmit callback
            if (!postChanges()) {
                e.preventDefault();
            }
        } else if (delta) {
            if (e.key === "ArrowUp") {
                e.preventDefault();

                if (inputValue === null) {
                    inputValue = value;
                }

                inputValue += delta;

                postChanges();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();

                if (inputValue === null) {
                    inputValue = value;
                }

                inputValue -= delta;

                postChanges();
            }
        }
    };

    return (
        <input
            type="text"
            className={inline ? "form-input-inline" : "form-input"}
            disabled={disabled}
            value={text}
            onBlur={postChanges}
            onChange={(e) => props.onChange(e.currentTarget.value)}
            onKeyDown={onKeyDown}
        />
    );
});
