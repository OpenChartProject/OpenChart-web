import assert from "assert";

import { isNumber } from "./util";

describe("util", () => {
    describe("#isNumber", () => {
        interface TestCase {
            input: string;
            expected: boolean;
            when: string;
        }

        const cases: TestCase[] = [
            {
                input: "1",
                expected: true,
                when: "input is a whole integer",
            },
            {
                input: "+1",
                expected: true,
                when: "input is a whole integer (with plus sign)",
            },
            {
                input: "-1",
                expected: true,
                when: "input is a negative integer",
            },
            {
                input: "123.45",
                expected: true,
                when: "input is a positive number",
            },
            {
                input: "-123.45",
                expected: true,
                when: "input is a negative number",
            },
            {
                input: "",
                expected: false,
                when: "input is an empty string",
            },
            {
                input: " ",
                expected: false,
                when: "input is blank",
            },
            {
                input: "foo",
                expected: false,
                when: "input is not a number",
            },
            {
                input: "123foo",
                expected: false,
                when: "input starts with a number but isn't entirely a number",
            },
            {
                input: "foo123",
                expected: false,
                when: "input ends with a number but isn't entirely a number",
            },
        ];

        cases.forEach((c) => {
            it(`returns expected value when ${c.when}`, () => {
                assert.strictEqual(isNumber(c.input), c.expected);
            });
        });
    });
});
