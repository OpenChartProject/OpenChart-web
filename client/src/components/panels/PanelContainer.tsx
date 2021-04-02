import React from "react";

export const PanelContainer = (props: React.PropsWithChildren<{}>) => {
    return <div className="panel-container">{props.children}</div>;
};
