import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { RootStore } from "../store/";

import { Music, Notefield } from ".";
import { NotificationContainer } from "./Notification";
import {
    AudioOffsetPanel,
    AudioPanel,
    BeatTimePanel,
    BPMPanel,
    NotefieldPanel,
    PanelContainer,
    SongPanel,
} from "./panels";
import { Toolbar } from "./Toolbar";
import { WelcomeModal } from "./WelcomeModal";

export interface Props {
    store: RootStore;
}

/**
 * The root component for the app. This is responsible for rendering the other
 * components. It also renders the welcome modal.
 */
export const App = observer((props: Props) => {
    const [showModal, setShowModal] = useState(props.store.ui.data.showWelcomeModal);
    const { store } = props;

    return (
        <div className="app-container">
            {showModal && <WelcomeModal store={store} onClose={() => setShowModal(false)} />}

            <NotificationContainer store={store} />

            <Music store={store} />

            <Toolbar store={store} />

            <Notefield store={store} />

            <PanelContainer store={store}>
                <BeatTimePanel store={store} />
                <SongPanel store={store} />
                <BPMPanel store={store} />
                <AudioOffsetPanel store={store} />
                <AudioPanel store={store} />
                <NotefieldPanel store={store} />
            </PanelContainer>
        </div>
    );
});
