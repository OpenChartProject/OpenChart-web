import { Beat } from "./beat";

export interface ChartObject {
    beat: Beat;
    key: number;
    type: "tap" | "hold";
}
