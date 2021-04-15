import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { RootStore } from "../store";
import { NotifyArgs } from "../store/ui";

export interface NotificationProps {
    args: NotifyArgs;
}

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

export const NotificationContainer = observer((props: NotificationContainerProps) => {
    const { ui } = props.store;
    const [id, setId] = useState(0);
    const [queue, setQueue] = useState<QueueItem[]>([]);

    const onNotification = (args: NotifyArgs) => {
        // Add the notification to the end of the queue
        setQueue(queue.concat({ args, id }));
        setId(id + 1);

        // Set a delay for removing the notification at the start of the queue.
        //
        setTimeout(() => {
            const copy = _.clone(queue);
            copy.splice(0, 1);
            setQueue(copy);
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
            {queue.map(({ args, id }) => (
                <Notification args={args} key={id} />
            ))}
        </div>
    );
});
