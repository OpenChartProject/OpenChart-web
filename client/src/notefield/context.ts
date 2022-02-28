import { Chart } from "../charting";
import { NoteSkin } from "../noteskin";
import { NotefieldDisplayStore, NotefieldStore } from "../store";

import { Viewport } from "./drawing/viewport";

/**
 * The data needed for determining positions and drawing the notefield
 */
export interface NotefieldContext {
    w: number;
    h: number;
    chart: Chart;
    noteSkin: NoteSkin;
    notefieldDisplay: NotefieldDisplayStore;
    notefield: NotefieldStore;
    viewport: Viewport;
}
