'use strict'

import {
    HighlightCodeHelper
} from './helper/highlightCodeHelper.js';

const LINE_HEIGHT = 1.15;
const ADDITIONNAL_HEIGT = 0.4;
const COL_WIDTH = 35;

export class HighlightEvents {
    constructor() {
        //  Polymer Declaration
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


    }
}