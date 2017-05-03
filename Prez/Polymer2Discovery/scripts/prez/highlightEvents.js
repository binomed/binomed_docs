'use strict'

import {
    HighlightCodeHelper
} from '../helpers/highlightCodeHelper.js';

const LINE_HEIGHT = 1.15;
const ADDITIONNAL_HEIGT = 0.4;
const COL_WIDTH = 35;

export class HighlightEvents {
    constructor() {
        //  Test
        new HighlightCodeHelper({
            keyElt: 'test',
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
                width: '40%'
            }]
        });

    }
}