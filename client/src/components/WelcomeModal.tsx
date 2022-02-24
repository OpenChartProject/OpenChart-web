import React from "react";

import { banner } from "../assets";
import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

/**
 * A simple modal that's displayed when the user loads the page.
 */
export const WelcomeModal = ({ store }: Props) => {
    const close = () => {
        store.ui.hideModal();
    };

    const dontShowAgain = () => {
        store.ui.update({ showWelcomeModal: false });
        close();
    };

    return (
        <div className="modal welcome-modal">
            <img className="oc-banner" src={banner} />

            <p>OpenChart is an open source rhythm game chart/map editor.</p>
            <p>
                <strong>
                    This project is currently in active development -- it is unfinished.
                </strong>
            </p>
            <p>See the links in the sidebar to learn more.</p>
            <button className="close-btn" onClick={close} autoFocus>
                OK
            </button>
            <a className="dont-show-again" onClick={dontShowAgain}>
                Don't show this again
            </a>
        </div>
    );
};
