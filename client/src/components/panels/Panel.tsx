import { observer } from "mobx-react-lite";
import React, { CSSProperties } from "react";

export interface Props {
    visible: boolean;
    onToggle(): void;
    title: string;
}

export const Panel = observer((props: React.PropsWithChildren<Props>) => {
    const { visible } = props;
    const style: CSSProperties = {};

    if (!visible) {
        style.display = "none";
    }

    return (
        <div className="panel">
            <div className={`panel-title ${!visible ? "collapsed" : ""}`} onClick={props.onToggle}>
                {props.title}
            </div>
            <div className="panel-content" style={style}>
                {props.children}
            </div>
        </div>
    );
});
