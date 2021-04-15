import { observer } from "mobx-react-lite";
import React from "react";

import { RootStore } from "../store";
import { NotifyArgs } from "../store/ui";

export interface NotificationProps {
    args: NotifyArgs;
}

export const Notification = observer((props: NotificationProps) => {
    return <div className="notification"></div>;
});

export interface NotificationContainerProps {
    store: RootStore;
}

export const NotificationContainer = observer((props: NotificationContainerProps) => {
    return <div className="notification-container"></div>;
});
