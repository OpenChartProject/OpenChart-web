import React from "react";
import { render } from "react-dom";

import "./assets";
import { App } from "./components/";
import { getNoteSkinSource, loadNoteSkin } from "./noteskin";
import { RootStore } from "./store";

export const store = new RootStore();

// Preload the noteskin before creating the editor.
loadNoteSkin(getNoteSkinSource("default_4k", 4)).then((noteSkin) => {
    store.notefieldDisplay.update({ noteSkin });

    render(<App store={store} />, document.getElementById("app") as HTMLElement);
});
