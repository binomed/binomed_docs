'use strict'

import {
    HighlightCodeHelper
} from './helper/highlightCodeHelper.js';

const LINE_HEIGHT = 1.15;
const ADDITIONNAL_HEIGT = 0.4;
const COL_WIDTH = 35;

export class HighlightEvents {
    constructor() {
        //  My var space explanation
        new HighlightCodeHelper({
            keyElt: 'myvar',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                height: '200px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '270px',
                height: '300px',
                leftMargin: '50px',
                width: '100%'
            }]
        });
        
        //  limit url concat
        new HighlightCodeHelper({
            keyElt: 'url',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                top: '0px',
                height: '180px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '0',
                height: '250px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '0',
                height: '450px',
                leftMargin: '50px',
                width: '100%'
            }]
        });
        
        //  limit Houdini
        new HighlightCodeHelper({
            keyElt: 'houdini',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                top: '0px',
                height: '280px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '280px',
                height: '50px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '330px',
                height: '50px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '380px',
                height: '350px',
                leftMargin: '50px',
                width: '100%'
            }]
        });

    }
}