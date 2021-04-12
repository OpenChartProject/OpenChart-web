import sinon from "sinon";

import Storage from "./storage";

window.requestAnimationFrame = () => 0;
globalThis.requestAnimationFrame = window.requestAnimationFrame;

beforeEach(() => {
    (globalThis.localStorage as any) = {
        getItem: sinon.stub(),
        removeItem: sinon.stub(),
        setItem: sinon.stub(),
        clear: sinon.stub(),
    };
});

afterEach(() => {
    Storage.clear();
    sinon.restore();
});
