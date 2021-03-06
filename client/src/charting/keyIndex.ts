import * as assert from "assert";

export class KeyIndex {
  private _value: number;

  constructor(value: number) {
    this.value = value;
  }

  set value(val: number) {
    assert(val >= 0, "key index cannot be negative");
    this._value = val;
  }

  get value(): number {
    return this._value;
  }
}
