import React from "react";

export interface Props {}

export const PanelContainer = (props: React.PropsWithChildren<Props>) => {
    return <div className="panel-container">{props.children}</div>;
};
