import { observer } from "mobx-react-lite";
import React, { CSSProperties, useState } from "react";

export interface Props {
    collapsed?: boolean;
    title: string;
}

export const Panel = observer((props: React.PropsWithChildren<Props>) => {
    const [collapsed, setCollapsed] = useState(props.collapsed ?? false);
    const style: CSSProperties = {};

    if (collapsed) {
        style.display = "none";
    }

    return (
        <div className="panel">
            <div
                className={`panel-title ${collapsed ? "collapsed" : ""}`}
                onClick={() => setCollapsed(!collapsed)}
            >
                {props.title}
            </div>
            <div className="panel-content" style={style}>
                {props.children}
            </div>
        </div>
    );
});
