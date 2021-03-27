import assert from "assert";
import sinon from "sinon";
import { Beat } from "../../charting/beat";
import { createStore } from "../../testutil";
import { ScrollAction, ScrollArgs } from "./scroll";

describe("ScrollAction", () => {
    describe("new", () => {
        it("throws if neither arg is set", () => {
            const store = createStore();
            assert.throws(() => new ScrollAction(store, {}));
        });
    });

    describe("#run", () => {
        it("calls scrollBy when 'by' arg is set", () => {
            const store = createStore();
            const args: ScrollArgs = {
                by: { beat: 1 },
            };
            const scrollBy = sinon.spy(store, "scrollBy");

            new ScrollAction(store, args).run();
            assert(scrollBy.calledWith(args.by));
        });

        it("calls setScroll when 'to' arg is set", () => {
            const store = createStore();
            const args: ScrollArgs = {
                to: { beat: Beat.Zero },
            };
            const setScroll = sinon.spy(store, "setScroll");

            new ScrollAction(store, args).run();
            assert(setScroll.calledWith(args.to));
        });
    });
});
