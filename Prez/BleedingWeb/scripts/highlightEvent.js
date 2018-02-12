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

    }
}