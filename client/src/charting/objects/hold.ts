import { Beat } from "../beat";
import { KeyIndex } from "../keyIndex";
import { ChartObject } from "./chartObject";

export class Hold implements ChartObject {
  beat: Beat;
  duration: Beat;
  key: KeyIndex;

  constructor(beat: Beat, duration: Beat, key: KeyIndex) {
    this.beat = beat;
    this.duration = duration;
    this.key = key;
  }
}
