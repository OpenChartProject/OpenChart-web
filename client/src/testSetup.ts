import sinon from "sinon";

globalThis.localStorage = window.localStorage;
window.requestAnimationFrame = (cb) => 0;
globalThis.requestAnimationFrame = window.requestAnimationFrame;

afterEach(() => {
    localStorage.clear();
    sinon.restore();
});
