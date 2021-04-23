import assert from "assert";

/**
 * Represents a (name, value) pair.
 */
export interface Field {
    name: string;
    value: string;
}

/**
 * The different states the reader can be in.
 */
enum State {
    lookingForField,
    readingName,
    readingValue,
    inComment,
}

/**
 * The different tokens that trigger the reader to change states.
 */
enum Token {
    comment = "/",
    fieldStart = "#",
    fieldNameEnd = ":",
    fieldValueEnd = ";",
    newLine = "\n",
}

/**
 * Reads the fields from a .sm file.
 * @param contents The string contents of the file.
 * @returns A list of fields.
 * @throws `AssertionError` if the reader hits EOF unexpectedly.
 */
export function readFields(contents: string): Field[] {
    const fields: Field[] = [];
    let state = State.lookingForField;
    let preCommentState: State = state;
    let prevChar = "";
    let buffer = "";
    let fieldName = "";

    for (const c of contents) {
        if (c === "\r") {
            continue;
        }

        if (c === Token.comment && prevChar === Token.comment) {
            preCommentState = state;
            state = State.inComment;

            if (buffer.length > 0) {
                buffer = buffer.slice(0, buffer.length - 1);
            }

            continue;
        }

        switch (state as State) {
            case State.lookingForField:
                if (c === Token.fieldStart) {
                    buffer = "";
                    state = State.readingName;
                }

                break;

            case State.readingName:
                if (c === Token.fieldNameEnd) {
                    fieldName = buffer.toUpperCase();
                    buffer = "";
                    state = State.readingValue;
                } else {
                    buffer += c;
                }

                break;

            case State.readingValue:
                if (c === Token.fieldValueEnd) {
                    fields.push({
                        name: fieldName,
                        value: buffer.trim(),
                    });

                    buffer = "";
                    state = State.lookingForField;
                } else {
                    buffer += c;
                }

                break;

            case State.inComment:
                if (c === Token.newLine) {
                    state = preCommentState;
                    buffer += c;
                }

                break;
        }

        prevChar = c;
    }

    assert(
        state !== State.readingName && state !== State.readingValue,
        "unexpected EOF while reading fields",
    );

    return fields;
}
