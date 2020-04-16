'use strict'

import {
    HighlightCodeHelper
} from './helper/highlightCodeHelper.js';

const LINE_HEIGHT = 1.15;
const ADDITIONNAL_HEIGT = 0.4;
const COL_WIDTH = 35;

export class HighlightEvents {
    constructor() {
        //  TYped OM New Possibilities
        new HighlightCodeHelper({
            keyElt: 'typedom-new',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 2,
                leftMargin: '50px',
                width: '100%'
            }, {
                line: 1,
                nbLines: 5,
                leftMargin: '50px',
                width: '100%'
            }, {
                line: 1,
                nbLines: 8,
                leftMargin: '50px',
                width: '100%'
            }, {
                line: 1,
                nbLines: 11,
                leftMargin: '50px',
                width: '100%'
            }]
        });

        //  Typed OM New Api
        new HighlightCodeHelper({
            keyElt: 'typedom-api',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 2,
                width: '100%'
            }, {
                line: 4,
                nbLines: 3,
                width: '100%'
            }, {
                line: 8,
                nbLines: 1,
                width: '100%'
            }, {
                line: 10,
                nbLines: 2,
                width: '100%'
            }]
        });


        //  Typed OM Conversion
        new HighlightCodeHelper({
            keyElt: 'typedom-conversion',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 6,
                width: '100%'
            }, {
                line: 8,
                nbLines: 2,
                width: '100%'
            }]
        });

        //  Typed OM Transform
        new HighlightCodeHelper({
            keyElt: 'typedom-transform',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 1,
                width: '100%'
            }, {
                line: 1,
                nbLines: 3,
                width: '100%'
            }, {
                line: 1,
                nbLines: 4,
                width: '100%'
            }, {
                line: 1,
                nbLines: 5,
                width: '100%'
            }, {
                line: 1,
                nbLines: 7,
                width: '100%'
            }]
        });

        // CSS Custom Properties
        new HighlightCodeHelper({
            keyElt: 'css-properties',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 3,
                width: '100%'
            }, {
                line: 5,
                nbLines: 3,
                width: '100%'
            }, {
                line: 9,
                nbLines: 3,
                width: '100%'
            }]
        });

        // CSS Properties & Values Types
        new HighlightCodeHelper({
            keyElt: 'propertiesvalues-type',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 1,
                width: '100%'
            }, {
                line: 3,
                nbLines: 1,
                width: '100%'
            }, {
                line: 5,
                nbLines: 1,
                width: '100%'
            }, {
                line: 7,
                nbLines: 1,
                width: '100%'
            }, {
                line: 9,
                nbLines: 1,
                width: '100%'
            }]
        });

        // Paint Api
        new HighlightCodeHelper({
            keyElt: 'paint-api',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 2,
                width: '100%'
            }, {
                line: 4,
                nbLines: 2,
                width: '100%'
            }, {
                line: 6,
                nbLines: 2,
                width: '100%'
            }, {
                line: 8,
                nbLines: 3,
                width: '100%'
            }, {
                line: 12,
                nbLines: 1,
                width: '100%'
            }]
        });

        // Animator Declaration
        new HighlightCodeHelper({
            keyElt: 'animator-declaration',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 3,
                width: '100%'
            }, {
                line: 5,
                nbLines: 4,
                width: '100%'
            }]
        });


        // Animator TimeLine & Register
        new HighlightCodeHelper({
            keyElt: 'animator-timeline',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                topMargin: '115px',
                line: 2,
                nbLines: 2,
                width: '100%'
            }, {
                topMargin: '115px',
                line: 5,
                nbLines: 6,
                width: '100%'
            }]
        });

        // Animator Effects
        new HighlightCodeHelper({
            keyElt: 'animator-effects',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 1,
                width: '700px'
            }, {
                line: 2,
                nbLines: 1,
                width: '100%'
            }, {
                line: 3,
                nbLines: 6,
                width: '100%'
            }, {
                line: 9,
                nbLines: 3,
                width: '100%'
            }]
        });

        // Animator Invoke
        new HighlightCodeHelper({
            keyElt: 'animator-invoke',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 1,
                width: '100%'
            }, {
                line: 1,
                nbLines: 2,
                width: '100%'
            }, {
                line: 1,
                nbLines: 3,
                width: '100%'
            }, {
                line: 1,
                nbLines: 5,
                width: '100%'
            }]
        });

        // Layout Api
        new HighlightCodeHelper({
            keyElt: 'layout-api',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 1,
                width: '100%'
            }, {
                line: 2,
                nbLines: 5,
                width: '100%'
            }, {
                line: 7,
                nbLines: 3,
                width: '100%'
            }, {
                line: 10,
                nbLines: 3,
                width: '100%'
            }]
        });

        // Layout Intrinsic calc
        new HighlightCodeHelper({
            keyElt: 'layout-intrinsic',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 1,
                width: '100%'
            }, {
                line: 2,
                nbLines: 3,
                width: '100%'
            }, {
                line: 5,
                nbLines: 6,
                width: '100%'
            }, {
                line: 11,
                nbLines: 1,
                width: '100%'
            }]
        });

        // Layout position fragments
        new HighlightCodeHelper({
            keyElt: 'layout-position',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 1,
                width: '100%'
            }, {
                line: 2,
                nbLines: 3,
                width: '100%'
            }, {
                line: 5,
                nbLines: 1,
                width: '100%'
            }, {
                line: 6,
                nbLines: 5,
                width: '100%'
            }, {
                line: 11,
                nbLines: 1,
                width: '100%'
            }]
        });

        // Parser Api
        new HighlightCodeHelper({
            keyElt: 'parser-api',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 1,
                width: '100%'
            }, {
                line: 1,
                nbLines: 2,
                width: '100%'
            }, {
                line: 4,
                nbLines: 4,
                width: '100%'
            }, {
                line: 4,
                nbLines: 7,
                width: '100%'
            }]
        });



    }
}