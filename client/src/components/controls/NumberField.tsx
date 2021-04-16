import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { isNumber } from "../../util";

export interface Props {
    delta?: number;
    disabled?: boolean;
    initialValue: number;
    inline?: boolean;
    precision?: number;
    onChanged?(val: number): void;
}

export const NumberField = observer((props: Props) => {
    const { delta, disabled, initialValue, inline, precision } = props;

    const valueToText = (val: number): string => {
        return precision != null ? val.toFixed(precision) : val.toString();
    };

    const [text, setText] = useState(valueToText(initialValue));
    let value = isNumber(text) ? _.toNumber(text) : null;

    useEffect(() => {
        setText(valueToText(initialValue));
    }, [initialValue]);

    // This is called once the user is done editing the field. Pressing enter and blurring
    // both trigger postChanges.
    const postChanges = () => {
        if (value === null) {
            return;
        }

        setText(valueToText(value));

        if (props.onChanged) {
            props.onChanged(value);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            postChanges();
        } else if (delta) {
            if (e.key === "ArrowUp") {
                e.preventDefault();

                if (value === null) {
                    value = initialValue;
                }

                value += delta;

                postChanges();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();

                if (value === null) {
                    value = initialValue;
                }

                value -= delta;

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
