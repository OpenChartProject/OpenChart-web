import fs from "fs";
import path from "path";

export const loadAll = () => {
    return {
        sinewave: fs.readFileSync(path.join(__dirname, "sine.ogg")),
    };
};
