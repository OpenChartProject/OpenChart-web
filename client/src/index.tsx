import React from "react";
import { render } from "react-dom";

import "./assets";
import { App, WelcomeModal } from "./components";
import { getNoteSkinSource, loadNoteSkin } from "./noteskin";
import { RootStore } from "./store";

declare global {
    interface NodeModule {
        hot?: {
            accept(fn?: () => void): void;
            dispose(fn?: () => void): void;
        };
    }
}

if (module.hot) {
    module.hot.accept();
}

export const store = new RootStore();

if (store.ui.data.showWelcomeModal) {
    const modal = <WelcomeModal store={store} />;
    store.ui.showModal(modal);
}

// Preload the noteskin before creating the editor.
loadNoteSkin(getNoteSkinSource("default_4k", 4)).then((noteSkin) => {
    store.notefieldDisplay.update({ noteSkin });

    render(<App store={store} />, document.getElementById("app") as HTMLElement);
});
