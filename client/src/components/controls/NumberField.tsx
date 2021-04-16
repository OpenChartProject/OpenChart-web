import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import { isNumber, toFixed } from "../../util";

export interface Props {
    delta?: number;
    disabled?: boolean;
    inline?: boolean;
    precision?: number;
    value: number;
    text: string;

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

    useEffect(() => {
        if (inputValue !== null && props.onValueChange) {
            props.onValueChange(inputValue);
        }
    }, [inputValue]);

    // Replace the input value when the value prop changes
    useEffect(() => {
        props.onChange(toFixed(value, precision));
    }, [value]);

    // This is called once the user is done editing the field. Pressing enter and blurring
    // both trigger postChanges.
    const postChanges = (): boolean => {
        // Reset the input if it's invalid or should be reformatted
        if (text.trim() === "" || inputValue === null || inputValue === value) {
            props.onChange(toFixed(value, precision));
            return false;
        }

        props.onChange(toFixed(inputValue, precision));

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
