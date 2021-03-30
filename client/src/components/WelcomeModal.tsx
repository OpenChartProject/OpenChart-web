import React from "react";

import { banner } from "../assets";

import { Modal } from "./Modal";

export interface Props {
    onClose(): void;
}

export const WelcomeModal = (props: Props) => {
    return (
        <Modal onClose={props.onClose} className="welcome-modal">
            <img className="oc-banner" src={banner} />

            <p>OpenChart is an open source rhythm game chart/map editor.</p>
            <p>
                <strong>
                    This project is currently in active development -- it is unfinished.
                </strong>
            </p>
            <p>See the links in the sidebar to learn more.</p>
            <button className="close-btn" onClick={props.onClose} autoFocus>
                OK
            </button>
        </Modal>
    );
};
