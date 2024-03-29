import { observer } from "mobx-react-lite";
import React from "react";

import { RootStore } from "../../store";

export interface Props {
    store: RootStore;
}

export const PanelContainer = observer((props: React.PropsWithChildren<Props>) => {
    const visible = props.store.ui.data.sidePanelVisible;

    const onToggle = () => {
        props.store.ui.update({ sidePanelVisible: !visible });
    };

    return (
        <div className={`panel-container-drawer ${!visible ? "closed" : ""}`}>
            <div className="panel-drawer-btns" title="Toggle side panel">
                {visible && (
                    /* Close button */
                    <div className="panel-drawer-btn" onClick={onToggle}>
                        &gt;
                    </div>
                )}
                {!visible && (
                    /* Open button */
                    <div className="panel-drawer-btn" onClick={onToggle}>
                        &lt;
                    </div>
                )}
            </div>

            <div className="panel-container">{props.children}</div>
        </div>
    );
});
