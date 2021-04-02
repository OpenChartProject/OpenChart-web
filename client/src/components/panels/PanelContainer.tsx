import React, { useState } from "react";

export interface Props {
    initClosed?: boolean;
}

export const PanelContainer = (props: React.PropsWithChildren<Props>) => {
    const [closed, setClosed] = useState(props.initClosed === true);

    const toggle = () => {
        setClosed(!closed);
    };

    return (
        <div className={`panel-container-drawer ${closed ? "closed" : ""}`}>
            <div className="panel-drawer-btns" title="Toggle side panel">
                {!closed && (
                    <div className="panel-drawer-btn" onClick={toggle}>
                        &gt;
                    </div>
                )}
                {closed && (
                    <div className="panel-drawer-btn" onClick={toggle}>
                        &lt;
                    </div>
                )}
            </div>

            <div className="panel-container">{props.children}</div>
        </div>
    );
};
