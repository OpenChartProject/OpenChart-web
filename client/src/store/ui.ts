import { EventEmitter } from "events";
import _ from "lodash";
import { makeAutoObservable } from "mobx";
import { PartialDeep } from "type-fest";

import { KeyBinds } from "../notefield/input";

import { MusicController } from "./controller";
import { RootStore } from "./store";

export interface PanelVisibility {
    audio: boolean;
    audioOffset: boolean;
    beatTime: boolean;
    songInfo: boolean;
    noteField: boolean;
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
    onPick?(): void;
    onCancel?(): void;
}

export interface UIData {
    metronome: MetronomeData;
    music: MusicData;

    sidePanelVisible: boolean;
    showWelcomeModal: boolean;

    keyBinds: KeyBinds;
    panelVisibility: PanelVisibility;
}

export class UIStore {
    readonly STORAGE_KEY = "ui";

    data!: UIData;
    readonly root: RootStore;

    controllers: {
        music: MusicController;
    };

    emitters: {
        // Emits a "tick" event.
        metronome: EventEmitter;

        // Emits a "play", "pause", and "seek" event.
        music: EventEmitter;
    };

    tools: {
        timePicker: {
            active: boolean;
            onPick?(): void;
            onCancel?(): void;
        };
    };

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            defaults: false,
            controllers: false,
            emitters: false,
        });

        this.root = root;

        this.controllers = {
            music: new MusicController(this),
        };

        this.emitters = {
            metronome: new EventEmitter(),
            music: new EventEmitter(),
        };

        this.tools = {
            timePicker: {
                active: false,
            },
        };

        // This loads the default editor config and overwrites it with the user's saved
        // config, if it exists.
        const defaults = this.defaults;
        const existing = localStorage.getItem(this.STORAGE_KEY);

        if (!existing) {
            this.update(defaults);
        } else {
            this.data = JSON.parse(existing);
            this.data = _.merge(defaults, this.data);
        }
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

            panelVisibility: {
                audio: true,
                audioOffset: true,
                beatTime: true,
                songInfo: true,
                noteField: true,
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
     * Sets the music source.
     */
    setMusic(src: string) {
        this.controllers.music.setSource(src);
        this.controllers.music.pause();
    }

    /**
     * Updates the config with the provided changes and saves it.
     */
    update(config: PartialDeep<UIData>) {
        this.data = _.merge(this.data || {}, config);
        this.save();
    }

    /**
     * Saves the editor config to the user's local storage.
     */
    save() {
        const clone = _.cloneDeep(this.data);

        // Remove any properties we don't want saved
        delete clone.music.src;

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clone));
    }
}
