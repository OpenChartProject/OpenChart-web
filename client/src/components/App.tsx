import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { Store } from "../store/";

import { NoteField } from "./NoteField";
import { Sidebar } from "./Sidebar";
import { WelcomeModal } from "./WelcomeModal";

export interface Props {
    store: Store;
}

export const App = observer((props: Props) => {
    const [showModal, setShowModal] = useState(true);

    return (
        <div className="app-container">
            {showModal && <WelcomeModal onClose={() => setShowModal(false)} />}
            <Sidebar store={props.store} />
            <NoteField store={props.store} />
        </div>
    );
});
