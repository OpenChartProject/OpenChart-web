import assert from "assert";
import Fraction from "fraction.js";
import sinon from "sinon";
import { createStore } from "../testutil";

describe("Store", () => {
    describe("#setCanvas", () => {
        it("sets the canvas element and updates the width", () => {
            const el = {};
            const store = createStore();

            store.setCanvas(el as HTMLCanvasElement);
            assert.strictEqual(store.el, el);
            assert.strictEqual(store.el.width, store.state.width);
        });
    });

    describe("#setHeight", () => {
        it("sets the height on the state if it's different", () => {
            const store = createStore();
            const spy = sinon.spy(store.state, "height", ["set"]);
            const h = store.state.height + 1;

            store.setHeight(h);
            assert.strictEqual(store.state.height, h);
            assert(spy.set.called);
        });

        it("sets the height on the element if provided and is different", () => {
            const el = { height: 0 };
            const store = createStore();
            const h = store.state.height + 1;

            store.setCanvas(el as HTMLCanvasElement);
            store.setHeight(h);

            assert.strictEqual(el.height, h);
        });

        it("doesn't do anything if the height is the same", () => {
            const el = { height: 0 };
            const store = createStore();
            const spy = sinon.spy(store.state, "height", ["set"]);
            const h = store.state.height;

            store.setCanvas(el as HTMLCanvasElement);
            store.setHeight(h);

            assert.strictEqual(el.height, 0);
            assert(spy.set.notCalled);
        });
    });

    describe("#setZoom", () => {
        it("throws if zoom is <= 0", () => {
            const store = createStore();
            assert.throws(() => store.setZoom(new Fraction(0)));
            assert.throws(() => store.setZoom(new Fraction(-1)));
        });

        it("sets zoom", () => {
            const store = createStore();
            const zoom = new Fraction(1, 2);

            store.setZoom(zoom);
            assert.strictEqual(store.state.zoom, zoom);
        });

        it("sets zoom to minZoom", () => {
            const store = createStore();
            const zoom = new Fraction(1, 9999999);

            store.setZoom(zoom);
            assert.strictEqual(store.state.zoom, store.minZoom);
        });

        it("sets zoom to maxZoom", () => {
            const store = createStore();
            const zoom = new Fraction(9999999);

            store.setZoom(zoom);
            assert.strictEqual(store.state.zoom, store.maxZoom);
        });

        it("doesn't set the zoom if it's already the same");
    });

    describe("#setScroll", () => {
        it("throws if both beat and time are not set");
        it("sets scroll using beat");
        it("sets scroll using time");
    });

    describe("#scrollBy", () => {
        it("throws if both beat and time are not set");
        it("scrolls by the beat amount");
        it("scrolls by the time amount");
        it("sets scroll to 0 if beat would go negative");
        it("sets scroll to 0 if time would go negative");
    });
});
