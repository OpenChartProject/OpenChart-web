import assert from "assert";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import sinon from "sinon";

import { RootStore } from "../../store";

import { PickTimeButton, Props } from "./PickTimeButton";

describe("components/PickTimeButton", () => {
    let container: HTMLElement | null = null;
    let store: RootStore;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        store = new RootStore();
    });

    afterEach(() => {
        unmountComponentAtNode(container!);
        container!.remove();
        container = null;
    });

    it("activates the time picker when clicked", () => {
        const props: Props = {
            store,
            onPick: sinon.fake(),
            onCancel: sinon.fake(),
        };

        act(() => {
            render(<PickTimeButton {...props} />, container);
        });

        const stub = sinon.stub(store.ui, "activateTimePicker");
        const button = container?.querySelector("button") as HTMLButtonElement;

        assert.strictEqual(button.innerHTML, "Pick Time");

        act(() => {
            button.click();
        });

        assert(stub.calledOnceWith({ onCancel: props.onCancel, onPick: props.onPick }));
    });
});
