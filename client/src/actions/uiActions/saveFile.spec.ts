import assert from "assert";
import sinon from "sinon";

import { SaveFileAction } from "./saveFile";

describe("SaveFileAction", () => {
    describe("#run", () => {
        it("creates the data URL with the provided mime type", () => {
            const el = document.createElement("a");
            sinon.stub(el, "click");

            new SaveFileAction({ data: "hello", el, fileName: "", mimeType: "type/test" }).run();

            assert.strictEqual(el.href, "data:type/test;charset=utf-8,hello");
        });

        it("encodes the data URL", () => {
            const el = document.createElement("a");
            sinon.stub(el, "click");

            new SaveFileAction({
                data: "hello there",
                el,
                fileName: "",
                mimeType: "type/test",
            }).run();

            assert.strictEqual(el.href, "data:type/test;charset=utf-8,hello%20there");
        });

        it("sets the filename", () => {
            const el = document.createElement("a");
            sinon.stub(el, "click");

            new SaveFileAction({ data: "", el, fileName: "test.txt" }).run();

            assert.strictEqual(el.download, "test.txt");
        });

        it("simulates a click", () => {
            const el = document.createElement("a");
            const click = sinon.stub(el, "click");

            new SaveFileAction({ data: "", el, fileName: "" }).run();

            assert(click.calledOnce);
        });
    });
});
