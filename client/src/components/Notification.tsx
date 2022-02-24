import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";

import { NotifyArgs, RootStore } from "../store";

export interface NotificationProps {
    args: NotifyArgs;
}

/**
 * A toast notification that appears at the top of the screen.
 */
export const Notification = observer((props: NotificationProps) => {
    const { type, msg } = props.args;

    let inner;

    if (type === "error") {
        inner = (
            <React.Fragment>
                <strong>error:</strong> {msg}
            </React.Fragment>
        );
    } else {
        inner = msg;
    }

    return <div className={`notification notif-type-${type}`}>{inner}</div>;
});

export interface NotificationContainerProps {
    store: RootStore;
}

const notificationDisplayTime = 7;

interface QueueItem {
    args: NotifyArgs;
    id: number;
}

interface ContainerState {
    lastId: number;
    queue: QueueItem[];
}

/**
 * A container for managing notifications being displayed.
 *
 * This listens for notifications emitted through `ui.emitters.notif`
 *
 * Notifications are queued up and displayed for a fixed amount of time before
 * they are automatically removed.
 */
export const NotificationContainer = observer((props: NotificationContainerProps) => {
    const { ui } = props.store;

    // The state needs to be stored in a ref so we can access it within onNotification.
    // Otherwise onNotification only sees the initial state.
    const state = useRef<ContainerState>({ lastId: 0, queue: [] });

    // Used for triggering a manual re-render since our state is stored in a ref.
    const [, setState] = useState({});

    const onNotification = (args: NotifyArgs) => {
        const { lastId, queue } = state.current;

        // Add the item to the queue and re-render
        state.current.queue = queue.concat({ args, id: lastId });
        state.current.lastId++;
        setState({});

        // Set a delay for removing the notification at the start of the queue.
        setTimeout(() => {
            state.current.queue.splice(0, 1);
            setState({});
        }, notificationDisplayTime * 1000);
    };

    useEffect(() => {
        ui.emitters.notif.addListener("notify", onNotification);
        return () => {
            ui.emitters.notif.removeListener("notify", onNotification);
        };
    }, []);

    return (
        <div className="notification-container">
            {state.current.queue.map(({ args, id }) => (
                <Notification args={args} key={id} />
            ))}
        </div>
    );
});
