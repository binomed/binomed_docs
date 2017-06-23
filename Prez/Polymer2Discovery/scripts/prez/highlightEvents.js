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
                nbLines: 8,
                left: '100px',
                width: '80%'
            }]
        });

        //  Component Template
        new HighlightCodeHelper({
            keyElt: 'component-template',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                width: '80%'
            }, {
                line: 2,
                left: '100px',
                nbLines: 5,
                width: '80%'
            }, {
                line: 7,
                nbLines: 3,
                left: '100px',
                width: '80%'
            }]
        });

        //  Component Template Use
        new HighlightCodeHelper({
            keyElt: 'component-template-use',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                width: '90%'
            }, {
                line: 2,
                width: '90%'
            }, {
                line: 3,
                nbLines: 4,
                width: '90%'
            }]
        });

        //  Component HTML Element
        new HighlightCodeHelper({
            keyElt: 'component-html-element',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                width: '90%'
            }, {
                line: 3,
                left: '100px',
                width: '90%'
            }, {
                line: 4,
                left: '150px',
                width: '90%'
            }, {
                line: 6,
                nbLines: 2,
                left: '150px',
                width: '90%'
            }]
        });

        //  Component Life Cycle
        new HighlightCodeHelper({
            keyElt: 'component-life-cycle',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 3,
                left: '100px',
                nbLines: 5,
                width: '90%'
            }, {
                line: 9,
                nbLines: 3,
                left: '100px',
                width: '90%'
            }]
        });

        //  Component Attributes
        new HighlightCodeHelper({
            keyElt: 'component-attributes',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 4,
                left: '100px',
                width: '90%'
            }, {
                line: 7,
                nbLines: 4,
                left: '100px',
                width: '90%'
            }]
        });

        //  Component Binding
        new HighlightCodeHelper({
            keyElt: 'component-binding',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 2,
                nbLines: 4,
                left: '100px',
                width: '90%'
            }, {
                line: 6,
                nbLines: 6,
                left: '100px',
                width: '90%'
            }]
        });

        //  Component dispatch
        new HighlightCodeHelper({
            keyElt: 'component-dispatch',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 5,
                left: '150px',
                width: '90%'
            }, {
                line: 8,
                nbLines: 5,
                left: '100px',
                width: '90%'
            }]
        });

        //  Component Shadow
        new HighlightCodeHelper({
            keyElt: 'component-shadow',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 2,
                nbLines: 2,
                width: '90%'
            }, {
                line: 5,
                nbLines: 3,
                width: '90%'
            }]
        });

        //  Polymer2 Base
        new HighlightCodeHelper({
            keyElt: 'polymer2-base',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 0,
                width: '90%'
            }, {
                line: 1,
                left: '100px',
                width: '90%'
            }, {
                line: 4,
                left: '100px',
                width: '90%'
            }, {
                line: 7,
                width: '90%'
            }]
        });

        //  Polymer2 Properties
        new HighlightCodeHelper({
            keyElt: 'polymer2-properties',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 3,
                left: '100px',
                width: '90%'
            }, {
                line: 4,
                left: '100px',
                nbLines: 3,
                width: '90%'
            }]
        });

        //  Polymer2 Templating
        new HighlightCodeHelper({
            keyElt: 'polymer2-templating',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                width: '90%'
            }, {
                line: 2,
                left: '100px',
                nbLines: 5,
                width: '90%'
            }]
        });

        //  Polymer2 Binding
        new HighlightCodeHelper({
            keyElt: 'polymer2-binding',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 3,
                left: '150px',
                nbLines: 3,
                width: '90%'
            }]
        });

        //  Polymer2 Polyfill
        new HighlightCodeHelper({
            keyElt: 'polymer2-polyfill',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 2,
                width: '90%'
            }, {
                line: 4,
                width: '90%'
            }, {
                line: 7,
                width: '90%'
            }, {
                line: 9,
                width: '90%'
            }]
        });

        //  Migration Content Polymer 1
        new HighlightCodeHelper({
            keyElt: 'migration-content-polymer1',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 5,
                width: '90%'
            }, {
                line: 3,
                left: '150px',
                width: '40%'
            }]
        });

        //  Migration Content Polymer 2
        new HighlightCodeHelper({
            keyElt: 'migration-content-polymer2',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 5,
                width: '90%'
            }, {
                line: 3,
                left: '150px',
                width: '40%'
            }]
        });

        //  Bower
        new HighlightCodeHelper({
            keyElt: 'bower',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 4,
                left: '100px',
                width: '90%'
            }, {
                line: 5,
                left: '100px',
                width: '90%'
            }]
        });

        //  Timer Header
        new HighlightCodeHelper({
            keyElt: 'timer-header',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                nbLines: 6,
                width: '90%'
            }, {
                line: 7,
                nbLines: 7,
                width: '90%'
            }]
        });

        //  Timer Template
        new HighlightCodeHelper({
            keyElt: 'timer-template',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 2,
                width: '50%'
            }, {
                line: 6,
                left: '720px',
                width: '330px'
            }, {
                line: 8,
                left: '760px',
                width: '180px'
            }]
        });

        //  Timer Script
        new HighlightCodeHelper({
            keyElt: 'timer-script',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                line: 1,
                width: '100%'
            }, {
                line: 1,
                left: '350px',
                width: '250px'
            }, {
                line: 1,
                left: '650px',
                width: '500px'
            }, {
                line: 2,
                nbLines: 4,
                width: '90%'
            }, {
                line: 8,
                left: '150px',
                width: '40%'
            }, {
                line: 12,
                width: '90%'
            }]
        });

    }
}