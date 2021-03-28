import assert from "assert";

import { readFields } from "./fieldReader";

describe("sm/fieldReader", () => {
    describe("#readFields", () => {
        it("returns an empty array if the content is empty", () => {
            assert(readFields("").length === 0);
        });

        it("reads an empty field", () => {
            const fields = readFields("#KEY:;");
            assert.deepStrictEqual(fields, [{ name: "KEY", value: "" }]);
        });

        it("reads multiple fields", () => {
            const fields = readFields("#FIELD1:a;\n#FIELD2:b;");
            assert.deepStrictEqual(fields, [
                { name: "FIELD1", value: "a" },
                { name: "FIELD2", value: "b" },
            ]);
        });

        it("reads multiline fields and converts CRLF to LF", () => {
            const fields = readFields("#FIELD1:abc\r\ndef;#FIELD2:foo\nbar;");
            assert.deepStrictEqual(fields, [
                { name: "FIELD1", value: "abc\ndef" },
                { name: "FIELD2", value: "foo\nbar" },
            ]);
        });

        it("ignores lines that start with a comment", () => {
            const fields = readFields("//#FIELD1:a;\n#FIELD2:b;");
            assert.deepStrictEqual(fields, [{ name: "FIELD2", value: "b" }]);
        });

        it("ignores comments in values", () => {
            const fields = readFields("#FIELD:multi// foo\nline;");
            assert.deepStrictEqual(fields, [{ name: "FIELD", value: "multi\nline" }]);
        });

        it("throws an error if it hits EOF while reading", () => {
            assert.throws(() => readFields("#KEY:value"));
        });
    });
});
