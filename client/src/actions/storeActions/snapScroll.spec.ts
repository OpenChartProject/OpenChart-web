import assert from "assert";
import sinon from "sinon";
import { Beat } from "../../charting/beat";

import { createStore } from "../../testutil";
import { SnapScrollAction, SnapScrollArgs } from "./snapScroll";

describe("SnapScrollAction", () => {
    describe("#run", () => {
        it("calls setScroll with expected args when direction is forward", () => {
            const store = createStore();
            const args: SnapScrollArgs = {
                direction: "forward",
            };
            const setScroll = sinon.spy(store, "setScroll");

            new SnapScrollAction(store, args).run();
            assert(setScroll.calledWith({ beat: new Beat(1) }));
        });

        it("calls setScroll with expected args when direction is backward", () => {
            const store = createStore();
            store.setScroll({ beat: new Beat(1) });
            const args: SnapScrollArgs = {
                direction: "backward",
            };
            const setScroll = sinon.spy(store, "setScroll");

            new SnapScrollAction(store, args).run();
            assert(setScroll.calledWith({ beat: Beat.Zero }));
        });
    });
});