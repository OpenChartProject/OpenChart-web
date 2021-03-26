import React, { useState } from "react";

export const WelcomeModal = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
        return null;
    }

    return (
        <div>
            <div className="dimmer"></div>
            <div className="modal welcome-modal">
                <img
                    className="oc-banner"
                    src="https://raw.githubusercontent.com/OpenChartProject/OpenChart/master/branding/banner_small.png"
                />

                <p>OpenChart is an open source rhythm game chart/map editor.</p>
                <p>
                    <strong>
                        This project is currently in active development -- it is
                        unfinished.
                    </strong>
                </p>
                <p>See the links in the sidebar to learn more.</p>
                <button className="close-btn" onClick={() => setVisible(false)}>
                    OK
                </button>
            </div>
        </div>
    );
};
