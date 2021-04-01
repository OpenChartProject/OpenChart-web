import assert from "assert";
import Fraction from "fraction.js";
import { makeAutoObservable, observable } from "mobx";

import { Beat, BeatTime, Chart, Time } from "../charting/";
import { NoteFieldConfig, NoteFieldState, ScrollDirection } from "../notefield/config";

import { AutoScroller } from "./autoScroller";
import { Music } from "./music";
import { UserConfigStorage } from "./userConfig";

/**
 * The store for the application.
 */
export class Store {
    config: NoteFieldConfig;
    state: NoteFieldState;
    el?: HTMLCanvasElement;

    autoScroller: AutoScroller;
    music: Music;

    constructor(config: NoteFieldConfig, state: NoteFieldState) {
        makeAutoObservable(this, {
        });
        this.config = config;
        this.state = makeAutoObservable(state, {
            zoom: observable.ref,
        });

        this.autoScroller = new AutoScroller(this);
        this.music = new Music();
    }

    /**
     * Enables or disables the metronome.
     */
    setMetronome(enabled: boolean) {
        this.state.enableMetronome = enabled;
        UserConfigStorage.update({ enableMetronome: enabled });
    }

    /**
     * Sets the scroll direction of the notefield.
     */
    setScrollDirection(direction: ScrollDirection) {
        if (direction !== this.config.scrollDirection) {
            this.config.scrollDirection = direction;
            UserConfigStorage.update({ scrollDirection: direction });
        }
    }
}
