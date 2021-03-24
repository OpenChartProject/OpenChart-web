import assert from "assert";
import Fraction from "fraction.js";
import sinon from "sinon";

import { createStore } from "../../test";
import { ScaleAction, ScaleArgs } from "./scale";

describe("ScaleAction", () => {
    describe("new", () => {
        it("throws if 'to' is not greater than zero", () => {
            const store = createStore();
            assert.throws(() => new ScaleAction(store, { to: new Fraction(0) }));
        });
    });

    describe("#run", () => {
        it("updates the scaling", () => {
            const store = createStore();
            const args: ScaleArgs = { to: new Fraction(1) };
            const spy = sinon.spy(store, "setScale");

            new ScaleAction(store, args).run();
            assert(spy.calledWith(args.to));
        });
    });
})
