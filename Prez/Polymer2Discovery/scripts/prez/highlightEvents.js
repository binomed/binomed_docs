'use strict'

import {
    HighlightCodeHelper
} from '../helpers/highlightCodeHelper.js';

const LINE_HEIGHT = 1.15;
const ADDITIONNAL_HEIGT = 0.4;
const COL_WIDTH = 35;

export class HighlightEvents {
    constructor() {
        //  Polymer Declaration
        new HighlightCodeHelper({
            keyElt: 'polymer1-declaration',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                width: '40%'
            }, {
                line: 2,
                nbLines: 4,
                left: '100px',
                width: '40%'
            }, {
                line: 9,
                width: '60%'
            }, {
                line: 11,
                width: '60%'
            }]
        });

        //  Polymer Life Cycle
        new HighlightCodeHelper({
            keyElt: 'polymer1-life-cycle',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 3,
                left: '100px',
                width: '80%'
            }, {
                line: 4,
                left: '100px',
                width: '80%'
            }, {
                line: 5,
                left: '100px',
                width: '80%'
            }, {
                line: 6,
                left: '100px',
                width: '80%'
            }, {
                line: 7,
                left: '100px',
                width: '80%'
            }]
        });

        //  Polymer Complete
        new HighlightCodeHelper({
            keyElt: 'polymer1-complete',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                width: '80%'
            }, {
                line: 2,
                left: '100px',
                nbLines: 3,
                width: '80%'
            }, {
                line: 5,
                nbLines:8,
                left: '100px',
                width: '80%'
            }]
        });

    }
}