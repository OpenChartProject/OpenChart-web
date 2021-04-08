import { observer } from "mobx-react-lite";
import React from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const Music = observer(({ store }: Props) => {
    return <audio></audio>;
});
