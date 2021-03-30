import React, { useEffect } from "react";

import { banner } from "../assets";

export interface Props {
    onClose(): void;
}

export const WelcomeModal = (props: Props) => {
    const onKeyDown = (e: KeyboardEvent) => {
        e.preventDefault();

        if (e.key === "Escape" || e.key === "Enter") {
            props.onClose();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <div>
            <div className="dimmer" onClick={props.onClose}></div>
            <div className="modal welcome-modal">
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
            </div>
        </div>
    );
};
