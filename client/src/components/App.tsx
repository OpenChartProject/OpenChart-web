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
    const [showModal, setShowModal] = useState(props.store.editor.data.showWelcomeModal);
    const { store } = props;

    return (
        <div className="app-container">
            {showModal && <WelcomeModal store={store} onClose={() => setShowModal(false)} />}
            <Toolbar store={store} />
            <NoteField store={store} />
            <PanelContainer store={store}>
                <SongPanel store={store} />
            </PanelContainer>
        </div>
    );
});
