import sinon from "sinon";

import Storage from "../storage";

import { loadAll } from "./data";

beforeEach(() => {
    window.requestAnimationFrame = () => 0;
    globalThis.requestAnimationFrame = window.requestAnimationFrame;

    (globalThis.localStorage as any) = null;

    sinon.stub(window, "setInterval");
    sinon.stub(window, "setTimeout");

    globalThis.setInterval = window.setInterval;
    globalThis.setTimeout = window.setTimeout;
});

afterEach(() => {
    Storage.clear();
    sinon.restore();
});

export const TestData = loadAll();
