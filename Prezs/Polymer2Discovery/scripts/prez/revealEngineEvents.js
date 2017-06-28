'use strict'
import {
    HighlightEvents
} from './highlightEvents.js';


export class RevealEngineEvents {
    constructor() {

        let inIFrame = window.top != window.self;

        // In al case we init the highlight of code.
        this._initHighlightCode();

    }

    _initHighlightCode() {

        new HighlightEvents();
    }
}