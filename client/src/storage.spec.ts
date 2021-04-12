import assert from "assert";
import sinon from "sinon";

import Storage from "./storage";

describe("Storage", () => {
    afterEach(() => {
        Storage.clear();
    });

    describe("#clear", () => {
        it("clears localStorage", () => {
            const stub = localStorage.clear as sinon.SinonStub;

            Storage.clear();

            assert(stub.called);
        });

        it("clears memory storage", () => {
            const stub = localStorage.clear as sinon.SinonStub;
            (localStorage as any) = null;

            Storage.set("foo", "bar");
            Storage.clear();

            assert(stub.notCalled);
            assert.strictEqual(Storage.get("foo"), null);
        });
    });

    describe("#del", () => {
        it("deletes the key from localStorage", () => {
            const stub = localStorage.removeItem as sinon.SinonStub;

            Storage.del("foo");

            assert(stub.calledWith("foo"));
        });

        it("deletes the key from memory", () => {
            const stub = localStorage.removeItem as sinon.SinonStub;
            (localStorage as any) = null;

            Storage.set("foo", "bar");
            Storage.del("foo");

            assert(stub.notCalled);
            assert.strictEqual(Storage.get("foo"), null);
        });
    });

    describe("#get", () => {
        it("returns the value from localStorage", () => {
            const stub = localStorage.getItem as sinon.SinonStub;
            stub.withArgs("foo").returns("bar");

            assert.strictEqual(Storage.get("foo"), "bar");
        });

        it("returns null from localStorage", () => {
            const stub = localStorage.getItem as sinon.SinonStub;
            stub.withArgs("foo").returns(null);

            assert.strictEqual(Storage.get("foo"), null);
        });

        it("returns the value from memory", () => {
            const stub = localStorage.getItem as sinon.SinonStub;
            (localStorage as any) = null;

            Storage.set("foo", "bar");

            assert.strictEqual(Storage.get("foo"), "bar");
            assert(stub.notCalled);
        });

        it("returns null from memory", () => {
            const stub = localStorage.getItem as sinon.SinonStub;
            (localStorage as any) = null;

            assert.strictEqual(Storage.get("foo"), null);
            assert(stub.notCalled);
        });
    });

    describe("#set", () => {
        it("sets the key in localStorage", () => {
            const stub = localStorage.setItem as sinon.SinonStub;

            Storage.set("foo", "bar");

            assert(stub.calledWith("foo", "bar"));
        });

        it("sets the key in memory", () => {
            const stub = localStorage.setItem as sinon.SinonStub;
            (localStorage as any) = null;

            Storage.set("foo", "bar");

            assert(stub.notCalled);
            assert.strictEqual(Storage.get("foo"), "bar");
        });
    });
});
