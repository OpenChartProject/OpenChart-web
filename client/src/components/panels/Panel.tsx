import { observer } from "mobx-react-lite";
import React from "react";

export interface Props {
    title: string;
}

export const Panel = observer((props: React.PropsWithChildren<Props>) => {
    return (
        <div className="panel">
            <div className="panel-title">{props.title}</div>
            <div className="panel-content">{props.children}</div>
        </div>
    );
});
