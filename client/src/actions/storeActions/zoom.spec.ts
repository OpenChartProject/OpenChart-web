import assert from "assert";
import Fraction from "fraction.js";
import sinon from "sinon";

import { createStore } from "../../testutil";

import { ZoomAction, ZoomArgs } from "./zoom";

describe("ScaleAction", () => {
    describe("new", () => {
        it("throws if 'to' is not greater than zero", () => {
            const store = createStore();
            assert.throws(() => new ZoomAction(store, { to: new Fraction(0) }));
        });
    });

    describe("#run", () => {
        it("updates the scaling", () => {
            const store = createStore();
            const args: ZoomArgs = { to: new Fraction(1) };
            const spy = sinon.spy(store, "setZoom");

            new ZoomAction(store, args).run();
            assert(spy.calledWith(args.to));
        });
    });
});
