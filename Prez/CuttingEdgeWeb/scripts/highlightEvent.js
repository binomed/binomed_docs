'use strict'

import {
    HighlightCodeHelper
} from './helper/highlightCodeHelper.js';

const LINE_HEIGHT = 1.15;
const ADDITIONNAL_HEIGT = 0.4;
const COL_WIDTH = 35;

export class HighlightEvents {
    constructor() {
        //  Css Variable Declaration
        new HighlightCodeHelper({
            keyElt: 'css-variable',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 4,
                width: '40%'
            }, {
                line: 5,
                nbLines: 4,
                width: '40%'
            }, {
                line: 9,
                nbLines: 4,
                width: '40%'
            }]
        });

        //  Css Variable Declaration in JS
        new HighlightCodeHelper({
            keyElt: 'css-variable-in-js',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                top: '100px',
                height: '260px',
                width: '60%'
            }, {
                top: '350px',
                height: '300px',
                width: '60%'
            }, {
                top: 0,
                height: '100%',
                width: '100%'
            }]
        });

        // ::Part
        new HighlightCodeHelper({
            keyElt: 'part',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                top: 0,
                height: '100%',
                width: '60%'
            }, {
                line: 3,
                nbLines: 4,
                width: '60%'
            }]
        });

        // Template Instantiation
        new HighlightCodeHelper({
            keyElt: 'template-instantiation',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 3,
                width: '100%'
            }, {
                line: 5,
                nbLines: 6,
                width: '100%'
            }, {
                top: 0,
                height: '100%',
                width: '100%'
            }]
        });

        // HTML Module
        new HighlightCodeHelper({
            keyElt: 'html-module',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 8,
                width: '100%'
            }, {
                line: 10,
                nbLines: 4,
                width: '100%'
            }, {
                top: 0,
                height: '100%',
                width: '100%'
            }]
        });

        // Paint API
        new HighlightCodeHelper({
            keyElt: 'paint-api',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 0,
                nbLines: 2,
                width: '100%'
            }, {
                line: 3,
                nbLines: 8,
                width: '100%'
            }, {
                line: 12,
                nbLines: 3,
                width: '100%'
            }]
        });


        // generic sensor
        new HighlightCodeHelper({
            keyElt: 'generic-sensor',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 0,
                nbLines: 1,
                width: '60%'
            }, {
                line: 2,
                nbLines: 3,
                width: '80%'
            }, {
                line: 6,
                nbLines: 2,
                width: '80%'
            }, {
                line: 9,
                nbLines: 3,
                width: '80%'
            }]
        });

        // Accelerometer sensor
        new HighlightCodeHelper({
            keyElt: 'accelerometer-sensor',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 0,
                nbLines: 4,
                width: '100%'
            }, {
                line: 6,
                nbLines: 1,
                left: '50px',
                width: '80%'
            }, {
                line: 7,
                left: '50px',
                nbLines: 5,
                width: '80%'
            }, {
                line: 13,
                nbLines: 1,
                left: '50px',
                width: '80%'
            }]
        });

    }
}