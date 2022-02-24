import assert from "assert";
import sinon from "sinon";

import { OpenFileDialogAction, OpenFileDialogArgs } from "./openFileDialog";

describe("OpenFileDialogAction", () => {
    describe("#run", () => {
        it("sets the attributes on the input element", () => {
            const el = document.createElement("input");
            el.type = "file";
            const args: OpenFileDialogArgs = { accept: ["a", "b", "c"], el };

            new OpenFileDialogAction(args).run();
            assert.strictEqual(el.accept, "a,b,c");
            assert.strictEqual(el.multiple, false);

            args.multiple = true;

            new OpenFileDialogAction(args).run();
            assert.strictEqual(el.multiple, true);
        });

        it("clicks the element", () => {
            const el = document.createElement("input");
            el.type = "file";
            const args: OpenFileDialogArgs = { accept: ["a"], el };
            const spy = sinon.spy(el, "click");

            new OpenFileDialogAction(args).run();

            assert(spy.calledOnce);
        });

        it("resolves when onchange is triggered", (done) => {
            const el = document.createElement("input");
            el.type = "file";
            const args: OpenFileDialogArgs = { accept: ["a"], el };

            new OpenFileDialogAction(args).run().then((files) => {
                assert.strictEqual(files, el.files);
                done();
            });

            el.onchange!({} as any);
        });
    });
});
