import { Time } from "../../charting";
import { NotefieldDisplayStore, NotefieldStore } from "../../store";

/**
 * Stores some useful values used for rendering.
 */
export interface Viewport {
    /**
     * The scroll position, in pixels. This is the y-pos with respect to the canvas origin.
     */
    y0: number;

    /**
     * The time at the top of the viewport.
     */
    t0: Time;

    /**
     * The time at the bottom of the viewport.
     */
    t1: Time;

    /**
     * The time at the receptors.
     */
    tReceptor: Time;
}

/**
 * This calculates both the scroll position of the viewport as well as the boundaries
 * for what should be rendered.
 *
 * The term "viewport" in this context is just a concept, it's not a physical object.
 * The objects on the notefield are rendered with respect to the canvas origin, not
 * with respect to the scrolling.
 */
export function calculateViewport(
    notefieldDisplay: NotefieldDisplayStore,
    notefield: NotefieldStore,
): Viewport {
    const y0 =
        notefield.data.scroll.time.value * notefield.pixelsPerSecond -
        notefieldDisplay.data.receptorY;
    const t0 = new Time(Math.max(y0 / notefield.pixelsPerSecond, 0));
    const t1 = new Time(Math.max((y0 + notefield.data.height) / notefield.pixelsPerSecond, 0));
    const tReceptor = notefield.data.scroll.time;

    return { y0, t0, t1, tReceptor };
}
