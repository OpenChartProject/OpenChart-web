export type NoteSkinImage = CanvasImageSource;

export interface NoteSkinSource {
    name: string;
    keyCount: number;
    hold: string[];
    holdBody: string[];
    receptor: string[];
    tap: string[];
}

export interface NoteSkin {
    name: string;
    keyCount: number;
    hold: NoteSkinImage[];
    holdBody: NoteSkinImage[];
    receptor: NoteSkinImage[];
    tap: NoteSkinImage[];
}

export function getNoteSkinSource(
    name: string,
    keyCount: number
): NoteSkinSource {
    const ns: NoteSkinSource = {
        name,
        keyCount,
        hold: [],
        holdBody: [],
        receptor: [],
        tap: [],
    };

    for (let i = 1; i <= keyCount; i++) {
        ns.hold.push(`/img/noteskins/${name}/hold_${i}.png`);
        ns.holdBody.push(`/img/noteskins/${name}/hold_body_${i}.png`);
        ns.receptor.push(`/img/noteskins/${name}/receptor_${i}.png`);
        ns.tap.push(`/img/noteskins/${name}/tap_${i}.png`);
    }

    return ns;
}

export function loadNoteSkin(src: NoteSkinSource): Promise<NoteSkin> {
    const promises: Promise<void>[] = [];
    const ns: NoteSkin = {
        name: src.name,
        keyCount: src.keyCount,
        hold: [],
        holdBody: [],
        receptor: [],
        tap: [],
    };

    const loadImage = (url: string, dst: CanvasImageSource[]): Promise<void> => {
        return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve();
            };
            img.src = url;
            dst.push(img);
        });
    }

    for (let i = 0; i < ns.keyCount; i++) {
        promises.push(
            loadImage(src.hold[i], ns.hold),
            loadImage(src.holdBody[i], ns.holdBody),
            loadImage(src.receptor[i], ns.receptor),
            loadImage(src.tap[i], ns.tap),
        );
    }

    return new Promise<NoteSkin>((resolve) => {
        Promise.all(promises).then(() => resolve(ns));
    });
}
