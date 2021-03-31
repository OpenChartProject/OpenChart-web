import React, { useEffect } from "react";

export interface Props {
    className?: string;
    onClose(): void;
}

export const Modal = (props: React.PropsWithChildren<Props>) => {
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
};
