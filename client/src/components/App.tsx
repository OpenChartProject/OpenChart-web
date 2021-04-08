import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { RootStore } from "../store/";

import { Metronome, Music, NoteField } from ".";
import { AudioPanel, BeatTimePanel, NoteFieldPanel, PanelContainer, SongPanel } from "./panels";
import { Toolbar } from "./Toolbar";
import { WelcomeModal } from "./WelcomeModal";

export interface Props {
    store: RootStore;
}

export const App = observer((props: Props) => {
    const [showModal, setShowModal] = useState(props.store.ui.data.showWelcomeModal);
    const { store } = props;

    return (
        <div className="app-container">
            {showModal && <WelcomeModal store={store} onClose={() => setShowModal(false)} />}

            <Metronome store={store} />
            <Music store={store} />

            <Toolbar store={store} />

            <NoteField store={store} />

            <PanelContainer store={store}>
                <BeatTimePanel store={store} />
                <SongPanel store={store} />
                <AudioPanel store={store} />
                <NoteFieldPanel store={store} />
            </PanelContainer>
        </div>
    );
});
