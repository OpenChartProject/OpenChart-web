import React, { useState } from "react";
import { RootStore } from "../../store";

export interface Props {
    store: RootStore;
}

export const PanelContainer = (props: React.PropsWithChildren<Props>) => {
    const [visible, setVisible] = useState(props.store.editor.config.sidePanelVisible);

    const toggle = () => {
        const newState = !visible;

        setVisible(newState);
        props.store.editor.update({ sidePanelVisible: newState });
    };

    return (
        <div className={`panel-container-drawer ${!visible ? "closed" : ""}`}>
            <div className="panel-drawer-btns" title="Toggle side panel">
                {visible && (
                    /* Open button */
                    <div className="panel-drawer-btn" onClick={toggle}>
                        &gt;
                    </div>
                )}
                {!visible && (
                    /* Close button */
                    <div className="panel-drawer-btn" onClick={toggle}>
                        &lt;
                    </div>
                )}
            </div>

            <div className="panel-container">{props.children}</div>
        </div>
    );
};
