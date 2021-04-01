import assert from "assert";
import Fraction from "fraction.js";
import sinon from "sinon";

import { createStore } from "../../testUtil";

import { SnapAdjustAction, SnapAdjustArgs } from "./snapAdjust";

describe("SnapAdjustAction", () => {
    describe("new", () => {
        it("throws if neither arg is set", () => {
            const store = createStore();
            assert.throws(() => new SnapAdjustAction(store, {}));
        });
    });

    describe("#run", () => {
        it("calls nextSnap when adjust is set to next", () => {
            const store = createStore();
            const { snap } = store.noteField.state;
            const args: SnapAdjustArgs = {
                adjust: "next",
            };
            const nextSnap = sinon.spy(snap, "nextSnap");

            new SnapAdjustAction(store, args).run();
            assert(nextSnap.calledOnce);
        });

        it("calls prevSnap when adjust is set to prev", () => {
            const store = createStore();
            const { snap } = store.noteField.state;
            const args: SnapAdjustArgs = {
                adjust: "prev",
            };
            const prevSnap = sinon.spy(snap, "prevSnap");

            new SnapAdjustAction(store, args).run();
            assert(prevSnap.calledOnce);
        });

        it("sets the current snap if 'to' is set", () => {
            const store = createStore();
            const { snap } = store.noteField.state;
            const args: SnapAdjustArgs = {
                to: new Fraction(1),
            };

            new SnapAdjustAction(store, args).run();
            assert.deepStrictEqual(snap.current, args.to);
        });
    });
});
