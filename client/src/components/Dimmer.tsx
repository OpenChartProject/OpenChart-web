import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { store } from "..";
import { RootStore } from "../store";

export interface Props {
    className?: string;
    store: RootStore;
}

/**
 * A simple Modal component. When displayed, this dims the entire page and shows
 * a modal with the component's children rendered as the contents.
 */
export const Dimmer = observer((props: React.PropsWithChildren<Props>) => {
    const closeModal = () => {
        store.ui.hideModal();
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            e.preventDefault();
            closeModal();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <div className="dimmer" onClick={closeModal}></div>
    );
});
