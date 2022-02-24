import React from "react";

import { RootStore } from "../../store";
import { ActivateTimePickerArgs } from "../../store/ui";

export interface Props extends ActivateTimePickerArgs {
    className?: string;
    disabled?: boolean;
    store: RootStore;
}

export const PickTimeButton = (props: Props) => {
    const { ui } = props.store;

    const onClick = () => {
        ui.activateTimePicker({
            onCancel: props.onCancel,
            onPick: props.onPick,
        });
    };

    return (
        <button
            type="button"
            className={`btn btn-secondary btn-thin ${props.className}`}
            disabled={props.disabled}
            onClick={onClick}
        >
            Pick Time
        </button>
    );
};
