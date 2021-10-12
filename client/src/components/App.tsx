import { observer } from "mobx-react-lite";
import React from "react";

import { RootStore } from "../store/";

import { Music, Notefield } from ".";
import { Dimmer } from "./Dimmer";
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

export interface Props {
    store: RootStore;
}

/**
 * The root component for the app. This is responsible for rendering the other
 * components. It also renders the welcome modal.
 */
export const App = observer((props: Props) => {
    const { store } = props;
    const { modal } = props.store.ui.data;

    return (
        <div className="app-container">
            {modal && (
                <div>
                    <Dimmer store={store} />
                    {modal}
                </div>
            )}

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
