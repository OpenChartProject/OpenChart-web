import fs from "fs";
import path from "path";
import WaveformData from "waveform-data";

export const loadAll = () => {
    // Generated with:  audiowaveform -i sine.ogg -o wavedata.json -b 8 -z 256
    // https://www.npmjs.com/package/waveform-data#receive-binary-waveform-data
    const jsonWaveData = fs.readFileSync(path.join(__dirname, "wavedata.json"));

    return {
        audio: {
            raw: fs.readFileSync(path.join(__dirname, "sine.ogg")),
            jsonWaveData,
            waveData: WaveformData.create(jsonWaveData),
        },
    };
};
