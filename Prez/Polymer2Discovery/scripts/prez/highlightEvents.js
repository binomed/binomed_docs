'use strict'

import {
    HighlightCodeHelper
} from '../helpers/highlightCodeHelper.js';

const LINE_HEIGHT = 1.15;
const ADDITIONNAL_HEIGT = 0.4;
const COL_WIDTH = 35;

export class HighlightEvents {
    constructor() {
        //  Bluetooth: Scan + Connect
        new HighlightCodeHelper({
            keyElt: 'connect-ble',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                row: 1,
                width: '90%'
            }, {
                row: 6,
                width: '90%'
            }]
        });

    }
}