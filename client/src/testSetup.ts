import sinon from "sinon";

globalThis.localStorage = window.localStorage;

afterEach(() => {
    localStorage.clear();
    sinon.restore();
});
