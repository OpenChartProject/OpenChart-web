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

    for (let i = 0; i < ns.keyCount; i++) {
        promises.push(
            new Promise<void>((resolve) => {
                console.log("asdf");
                const img = new Image();
                img.onload = () => {
                    console.log("resolved");
                    resolve();
                };
                img.src = src.hold[i];
                ns.hold.push(img);
            })
        );
    }

    return new Promise<NoteSkin>((resolve) => {
        Promise.all(promises).then(() => resolve(ns));
    });
}
