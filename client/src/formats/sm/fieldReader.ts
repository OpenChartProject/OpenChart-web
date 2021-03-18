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
    LookingForField,
    ReadingName,
    ReadingValue,
    InComment,
}

/**
 * The different tokens that trigger the reader to change states.
 */
enum Token {
    Comment = "/",
    FieldStart = "#",
    FieldNameEnd = ":",
    FieldValueEnd = ";",
    NewLine = "\n",
}

/**
 * Reads the fields from a .sm file.
 * @param contents The string contents of the file.
 * @returns A list of fields.
 * @throws `AssertionError` if the reader hits EOF unexpectedly.
 */
export function readFields(contents: string): Field[] {
    const fields: Field[] = [];
    let state = State.LookingForField;
    let preCommentState: State = state;
    let prevChar = "";
    let buffer = "";
    let fieldName = "";

    for (const c of contents) {
        if (c === "\r") {
            continue;
        }

        if (c === Token.Comment && prevChar === Token.Comment) {
            preCommentState = state;
            state = State.InComment;

            if (buffer.length > 0) {
                buffer = buffer.slice(0, buffer.length - 1);
            }

            continue;
        }

        switch (state as State) {
            case State.LookingForField:
                if (c === Token.FieldStart) {
                    buffer = "";
                    state = State.ReadingName;
                }

                break;

            case State.ReadingName:
                if (c === Token.FieldNameEnd) {
                    fieldName = buffer.toUpperCase();
                    buffer = "";
                    state = State.ReadingValue;
                } else {
                    buffer += c;
                }

                break;

            case State.ReadingValue:
                if (c === Token.FieldValueEnd) {
                    fields.push({
                        name: fieldName,
                        value: buffer.trim(),
                    });

                    buffer = "";
                    state = State.LookingForField;
                } else {
                    buffer += c;
                }

                break;

            case State.InComment:
                if (c === Token.NewLine) {
                    state = preCommentState;
                    buffer += c;
                }

                break;
        }

        prevChar = c;
    }

    assert(
        state !== State.ReadingName && state !== State.ReadingValue,
        "unexpected EOF while reading fields",
    );

    return fields;
}
