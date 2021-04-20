import { EventEmitter } from "events";
import _ from "lodash";
import { makeAutoObservable } from "mobx";

import { KeyBinds } from "../notefield/input";
import Storage from "../storage";

import { MetronomeController, MusicController } from "./controllers";
import { RootStore } from "./root";

export interface NotifyArgs {
    msg: string;
    type: "error" | "ok";
}

export interface Panels {
    audio: { visible: boolean };
    audioOffset: { visible: boolean };
    beatTime: { visible: boolean };
    bpm: { visible: boolean };
    songInfo: { visible: boolean };
    notefield: { visible: boolean };
}

export interface MetronomeData {
    enabled: boolean;
    volume: number;
}

export interface MusicData {
    src?: string;
    volume: number;
}

export interface ActivateTimePickerArgs {
    onPick?(y: number, time: number): void;
    onCancel?(): void;
}

export interface UIData {
    metronome: MetronomeData;
    music: MusicData;

    sidePanelVisible: boolean;
    showWelcomeModal: boolean;

    keyBinds: KeyBinds;
    panels: Panels;
}

export class UIStore {
    static readonly STORAGE_KEY = "ui";

    data!: UIData;
    readonly root: RootStore;

    controllers: {
        metronome: MetronomeController;
        music: MusicController;
    };

    emitters: {
        // Emits a "play", "pause", and "seek" event. See the MusicController for more info
        music: EventEmitter;

        // Emits a "notify" event. See the notify method for more info
        notif: EventEmitter;
    };

    tools: {
        timePicker: {
            active: boolean;
        } & ActivateTimePickerArgs;
    };

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            defaults: false,
            controllers: false,
            emitters: false,
        });

        this.root = root;

        this.controllers = {
            metronome: new MetronomeController(this.root),
            music: new MusicController(this),
        };

        this.emitters = {
            music: new EventEmitter(),
            notif: new EventEmitter(),
        };

        this.tools = {
            timePicker: {
                active: false,
            },
        };

        // This loads the default editor config and overwrites it with the user's saved
        // config, if it exists.
        const defaults = this.defaults;
        const existing = Storage.get(UIStore.STORAGE_KEY);

        if (!existing) {
            this.update(defaults);
        } else {
            this.data = JSON.parse(existing);
            this.data = _.merge(defaults, this.data);
        }

        this.controllers.metronome.setMuted(!this.data.metronome.enabled);
        this.controllers.metronome.setVolume(this.data.metronome.volume);
    }

    get defaults(): UIData {
        return {
            metronome: {
                enabled: true,
                volume: 0.5,
            },

            music: {
                volume: 0.8,
            },

            sidePanelVisible: true,
            showWelcomeModal: true,

            keyBinds: {
                keys: {
                    4: ["1", "2", "3", "4"],
                },
                scroll: {
                    up: "ArrowUp",
                    down: "ArrowDown",
                    snapNext: "ArrowRight",
                    snapPrev: "ArrowLeft",
                },
                playPause: " ",
            },

            panels: {
                audio: { visible: true },
                audioOffset: { visible: true },
                beatTime: { visible: true },
                bpm: { visible: true },
                songInfo: { visible: true },
                notefield: { visible: true },
            },
        };
    }

    activateTimePicker(args: ActivateTimePickerArgs) {
        const { timePicker } = this.tools;

        timePicker.active = true;
        timePicker.onCancel = args.onCancel;
        timePicker.onPick = args.onPick;
    }

    deactivateTimePicker() {
        const { timePicker } = this.tools;

        timePicker.active = false;
        timePicker.onCancel = undefined;
        timePicker.onPick = undefined;
    }

    /**
     * Emits a notify event with the notification info. This is consumed by a
     * notification component that displays the message to the user.
     */
    notify(args: NotifyArgs) {
        this.emitters.notif.emit("notify", args);
    }

    setMetronomeEnabled(enabled: boolean) {
        this.controllers.metronome.setMuted(!enabled);
        this.updateProperty("metronome", { enabled });
    }

    /**
     * Sets the volume for the metronome.
     */
    setMetronomeVolume(val: number) {
        this.controllers.metronome.setVolume(val);
        this.updateProperty("metronome", { volume: val });
    }

    /**
     * Sets the music source.
     */
    setMusic(src: string) {
        this.controllers.music.setSource(src);
        this.controllers.music.pause();
    }

    /**
     * Updates the config with the provided changes and saves it.
     */
    update(config: Partial<UIData>) {
        this.data = _.merge(this.data || {}, config);
        this.save();
    }

    /**
     * Updates a specific panel.
     */
    updatePanel<K extends keyof Panels>(key: K, value: Partial<Panels[K]>) {
        this.data.panels[key] = _.merge(this.data.panels[key] || {}, value) as Panels[K];
        this.save();
    }

    /**
     * Updates a specific property in the config and saves it.
     *
     * This is useful for doing updates on properties that are objects.
     */
    updateProperty<K extends keyof UIData>(key: K, value: Partial<UIData[K]>) {
        this.data[key] = _.merge(this.data[key] || {}, value) as UIData[K];
        this.save();
    }

    /**
     * Saves the editor config to the user's local storage.
     */
    save() {
        const clone = _.cloneDeep(this.data);

        // Remove any properties we don't want saved
        delete clone.music.src;

        Storage.set(UIStore.STORAGE_KEY, JSON.stringify(clone));
    }
}
