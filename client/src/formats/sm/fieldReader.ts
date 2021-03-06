import assert from "assert";

export interface Field {
    name: string;
    value: string;
}

enum State {
    LookingForField,
    ReadingName,
    ReadingValue,
    InComment,
}

const token = {
    COMMENT: "/",
    FIELD_START: "#",
    FIELD_NAME_END: ":",
    FIELD_VALUE_END: ";",
    NEWLINE: "\n",
};

export function readFields(contents: string): Field[] {
    const fields: Field[] = [];
    let state = State.LookingForField;
    let preCommentState: State = state;
    let prevChar = "";
    let buffer = "";
    let fieldName = "";

    for (const c of contents) {
        if (c === "\r") continue;

        if (c === token.COMMENT && prevChar === token.COMMENT) {
            preCommentState = state;
            state = State.InComment;

            if (buffer.length > 0) buffer = buffer.slice(0, buffer.length - 1);

            continue;
        }

        switch (state as State) {
            case State.LookingForField:
                if (c === token.FIELD_START) {
                    buffer = "";
                    state = State.ReadingName;
                }

                break;

            case State.ReadingName:
                if (c === token.FIELD_NAME_END) {
                    fieldName = buffer.toUpperCase();
                    buffer = "";
                    state = State.ReadingValue;
                } else {
                    buffer += c;
                }

                break;

            case State.ReadingValue:
                if (c === token.FIELD_VALUE_END) {
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
                if (c === token.NEWLINE) {
                    state = preCommentState;
                    buffer += c;
                }

                break;
        }

        prevChar = c;
    }

    assert(
        state !== State.ReadingName && state !== State.ReadingValue,
        "unexpected EOF while reading fields"
    );

    return fields;
}
