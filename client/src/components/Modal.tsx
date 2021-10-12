import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

export interface Props {
    className?: string;
    onClose(): void;
}

/**
 * A simple Modal component. When displayed, this dims the entire page and shows
 * a modal with the component's children rendered as the contents.
 */
export const Modal = observer((props: React.PropsWithChildren<Props>) => {
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            e.preventDefault();
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
            <div className={`modal ${props.className || ""}`}>{props.children}</div>
        </div>
    );
});
