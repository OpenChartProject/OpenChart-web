import assert from "assert";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import sinon from "sinon";

import { NumberField, Props } from "./NumberField";

describe("components/NumberField", () => {
    let container: HTMLElement | null = null;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container!);
        container!.remove();
        container = null;
    });

    it("renders with the initial text", () => {
        const props: Props = {
            text: "0.00",
            onChange: sinon.fake(),
            value: 0,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        const input = container?.querySelector("input") as HTMLInputElement;

        assert.strictEqual(input.value, props.text);
    });

    it("calls onChange when the value prop changes", () => {
        const onChange = sinon.spy();
        const props: Props = {
            text: "",
            onChange,
            value: 0,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        onChange.resetHistory();

        act(() => {
            props.value++;
            render(<NumberField {...props} />, container);
        });

        assert.strictEqual(onChange.firstCall.firstArg, "1");
    });

    it("calls onChange when the field is blurred", () => {
        const onChange = sinon.spy();
        const props: Props = {
            text: "",
            onChange,
            value: 0,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        const input = container?.querySelector("input") as HTMLInputElement;
        onChange.resetHistory();

        act(() => {
            input.focus();
        });

        assert(onChange.notCalled);

        act(() => {
            input.blur();
        });

        assert(onChange.calledOnceWith("0"));
    });

    it("calls onChange when the user presses enter", () => {
        const onChange = sinon.spy();
        const props: Props = {
            text: "",
            onChange,
            value: 0,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        const input = container?.querySelector("input") as HTMLInputElement;
        onChange.resetHistory();

        act(() => {
            input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
        });

        assert(onChange.calledOnceWith("0"));
    });

    it("does not call onChange if the field input hasn't changed", () => {
        const onChange = sinon.spy();
        const props: Props = {
            text: "0",
            onChange,
            value: 0,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        const input = container?.querySelector("input") as HTMLInputElement;
        onChange.resetHistory();

        act(() => {
            input.focus();
            input.blur();
        });

        assert(onChange.notCalled);
    });

    it("formats the input on blur", () => {
        const onChange = sinon.spy();
        const props: Props = {
            text: "",
            onChange,
            precision: 3,
            value: 1.23,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        const input = container?.querySelector("input") as HTMLInputElement;
        onChange.resetHistory();

        act(() => {
            input.focus();
            input.blur();
        });

        assert(onChange.calledOnceWith("1.230"));
    });

    it("trims the input on blur", () => {
        const onChange = sinon.spy();
        const props: Props = {
            text: "",
            onChange,
            precision: 3,
            trim: true,
            value: 1.23,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        const input = container?.querySelector("input") as HTMLInputElement;
        onChange.resetHistory();

        act(() => {
            input.focus();
            input.blur();
        });

        assert(onChange.calledOnceWith("1.23"));
    });

    it("adjusts by delta", () => {
        const onChange = sinon.spy();
        const props: Props = {
            text: "0",
            onChange,
            value: 0,
            delta: 0.01,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        const input = container?.querySelector("input") as HTMLInputElement;
        onChange.resetHistory();

        act(() => {
            input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowUp" }));
        });

        assert(onChange.calledOnceWith("0.01"));

        props.text = "0.01";
        props.value = 0.01;

        act(() => {
            render(<NumberField {...props} />, container);
        });

        onChange.resetHistory();

        act(() => {
            input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }));
        });

        assert(onChange.calledOnceWith("0"));
    });
});
