import assert from "assert";
import sinon from "sinon";

import { Beat } from "../../charting/";
import { createStore } from "../../testUtil";

import { SnapScrollAction, SnapScrollArgs } from "./snapScroll";

describe("SnapScrollAction", () => {
    describe("#run", () => {
        it("calls setScroll with expected args when direction is forward", () => {
            const store = createStore();
            const args: SnapScrollArgs = {
                direction: "forward",
            };
            const spy = sinon.spy();
            sinon.replace(store.noteField, "setScroll", spy);

            new SnapScrollAction(store, args).run();
            assert(spy.calledWith({ beat: new Beat(1) }));
        });

        it("calls setScroll with expected args when direction is backward", () => {
            const store = createStore();
            store.noteField.setScroll({ beat: new Beat(1) });
            const args: SnapScrollArgs = {
                direction: "backward",
            };
            const spy = sinon.spy();
            sinon.replace(store.noteField, "setScroll", spy);

            new SnapScrollAction(store, args).run();
            assert(spy.calledWith({ beat: Beat.Zero }));
        });
    });
});
