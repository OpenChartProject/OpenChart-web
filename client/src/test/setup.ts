import sinon from "sinon";

import Storage from "../storage";

import { loadAll } from "./data";

beforeEach(() => {
    window.requestAnimationFrame = () => 0;
    (globalThis.localStorage as any) = null;
    globalThis.requestAnimationFrame = window.requestAnimationFrame;
});

afterEach(() => {
    Storage.clear();
    sinon.restore();
});

export const TestData = loadAll();
