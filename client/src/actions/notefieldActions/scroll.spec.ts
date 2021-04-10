import assert from "assert";
import sinon from "sinon";

import { Beat } from "../../charting";
import { createStore } from "../../testUtil";

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
            const spy = sinon.spy();
            sinon.replace(store.notefield, "scrollBy", spy);

            new ScrollAction(store, args).run();
            assert(spy.calledWith(args.by));
        });

        it("calls setScroll when 'to' arg is set", () => {
            const store = createStore();
            const args: ScrollArgs = {
                to: { beat: Beat.Zero },
            };
            const spy = sinon.spy();
            sinon.replace(store.notefield, "setScroll", spy);

            new ScrollAction(store, args).run();
            assert(spy.calledWith(args.to));
        });
    });
});
