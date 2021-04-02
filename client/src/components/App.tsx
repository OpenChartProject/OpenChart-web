import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { RootStore } from "../store/";

import { NoteField } from "./NoteField";
import { PanelContainer, SongPanel } from "./panels";
import { Toolbar } from "./Toolbar";
import { WelcomeModal } from "./WelcomeModal";

export interface Props {
    store: RootStore;
}

export const App = observer((props: Props) => {
    const [showModal, setShowModal] = useState(true);

    return (
        <div className="app-container">
            {showModal && <WelcomeModal onClose={() => setShowModal(false)} />}
            <Toolbar store={props.store} />
            <NoteField store={props.store} />
            <PanelContainer>
                <SongPanel store={props.store} />
            </PanelContainer>
        </div>
    );
});
