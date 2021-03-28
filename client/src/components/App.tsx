import { observer } from "mobx-react-lite";
import React from "react";

import { Store } from "../store/";

import { NoteField } from "./NoteField";
import { Sidebar } from "./Sidebar";
import { WelcomeModal } from "./WelcomeModal";

export interface Props {
    store: Store;
}

export const App = observer((props: Props) => {
    return (
        <div className="app-container">
            <WelcomeModal />
            <Sidebar store={props.store} />
            <NoteField store={props.store} />
        </div>
    );
});
