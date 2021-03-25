import { observer } from "mobx-react-lite";
import React from "react";
import { NoteField } from "./components/NoteField";
import { Sidebar } from "./components/Sidebar";
import { Store } from "./store/store";

export interface Props {
    store: Store;
}

export const App = observer((props: Props) => {
    return (
        <div className="app-container">
            <Sidebar />
            <NoteField store={props.store} />
        </div>
    );
});
