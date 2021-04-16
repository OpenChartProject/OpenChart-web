import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { toFixed } from "../../util";

import { NumberField, Props as NumberFieldProps } from "./NumberField";

export type Props = Omit<NumberFieldProps, "text" | "onChange">;

/**
 * This is a simple wrapper around the NumberField component.
 *
 * This is useful if you don't need to change the text of a field, e.g. with a reset button.
 */
export const ManagedNumberField = observer((props: Props) => {
    const [text, setText] = useState(toFixed(props.value, props.precision ?? null));

    return <NumberField {...props} text={text} onChange={(val) => setText(val)} />;
});
