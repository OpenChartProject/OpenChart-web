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

    it("does not call onValueChange if the field text hasn't changed", () => {
        const onValueChange = sinon.spy();
        const props: Props = {
            text: "0",
            onChange: sinon.fake(),
            onValueChange,
            value: 0,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        const input = container?.querySelector("input") as HTMLInputElement;
        onValueChange.resetHistory();

        act(() => {
            input.focus();
            input.blur();
        });

        assert(onValueChange.notCalled);
    });

    it("calls onValueChange if the field value changes", () => {
        const onValueChange = sinon.spy();
        const props: Props = {
            text: "0",
            onChange: sinon.fake(),
            onValueChange,
            value: 0,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        onValueChange.resetHistory();
        props.text = "1";

        act(() => {
            render(<NumberField {...props} />, container);
        });

        assert(onValueChange.calledOnceWith(1));
    });

    it("prevents enter event from propagating if input is invalid", () => {
        const onFormSubmit = sinon.spy();
        const props: Props = {
            text: "",
            onChange: sinon.fake(),
            value: 0,
        };

        act(() => {
            render(
                <form onSubmit={onFormSubmit}>
                    <NumberField {...props} />
                </form>,
                container,
            );
        });

        const input = container?.querySelector("input") as HTMLInputElement;

        act(() => {
            input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
        });

        assert(onFormSubmit.notCalled);
    });

    it("prevents enter event from propagating if input is the same", () => {
        const onKeyDown = sinon.spy();
        const props: Props = {
            text: "0",
            onChange: sinon.fake(),
            value: 0,
        };

        act(() => {
            render(
                <div onKeyDown={onKeyDown}>
                    <NumberField {...props} />
                </div>,
                container,
            );
        });

        const input = container?.querySelector("input") as HTMLInputElement;

        act(() => {
            input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
        });

        assert(onKeyDown.notCalled);
    });

    it("propagates enter event when input is different", () => {
        const onKeyDown = sinon.spy();
        const props: Props = {
            text: "1",
            onChange: sinon.fake(),
            value: 0,
        };

        act(() => {
            render(
                <div onKeyDown={onKeyDown}>
                    <NumberField {...props} />
                </div>,
                container,
            );
        });

        const input = container?.querySelector("input") as HTMLInputElement;

        act(() => {
            input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
        });

        assert(onKeyDown.calledOnce);
        const e = onKeyDown.firstCall.firstArg as KeyboardEvent;
        assert.strictEqual(e.key, "Enter");
    });

    it("does not call onSubmit when pressing enter if the value hasn't changed", () => {
        const onSubmit = sinon.spy();
        const props: Props = {
            text: "1",
            onChange: sinon.fake(),
            onSubmit,
            value: 1,
        };

        act(() => {
            render(<NumberField {...props} />, container);
        });

        const input = container?.querySelector("input") as HTMLInputElement;

        act(() => {
            input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
        });

        assert(onSubmit.notCalled);
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
