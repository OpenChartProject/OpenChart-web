import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { isNumber } from "../../util";

export interface Props {
    delta?: number;
    disabled?: boolean;
    inline?: boolean;
    precision?: number;
    value: number;

    onChanged?(val: number): void;
}

export const NumberField = observer((props: Props) => {
    const { delta, disabled, value, inline, precision } = props;

    const valueToText = (val: number): string => {
        return precision != null ? val.toFixed(precision) : val.toString();
    };

    const [text, setText] = useState(valueToText(value));
    let inputValue = isNumber(text) ? _.toNumber(text) : null;

    useEffect(() => {
        setText(valueToText(value));
    }, [value]);

    // This is called once the user is done editing the field. Pressing enter and blurring
    // both trigger postChanges.
    const postChanges = () => {
        if (inputValue !== null && props.onChanged) {
            props.onChanged(inputValue);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            postChanges();
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
            onChange={(e) => setText(e.currentTarget.value)}
            onKeyDown={onKeyDown}
        />
    );
});
