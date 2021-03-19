import { Beat } from "../beat";
import { KeyIndex } from "../keyIndex";

export interface ChartObject {
    beat: Beat;
    key: KeyIndex;
    type: Readonly<string>;
}
