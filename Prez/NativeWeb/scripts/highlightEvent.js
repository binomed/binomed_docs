'use strict'

import {
    HighlightCodeHelper
} from './helper/highlightCodeHelper.js';

const LINE_HEIGHT = 1.15;
const ADDITIONNAL_HEIGT = 0.4;
const COL_WIDTH = 35;

export class HighlightEvents {
    constructor() {
        //  Read File space explanation
        new HighlightCodeHelper({
            keyElt: 'read-file',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                top: '110px',
                height: '150px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '250px',
                height: '80px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '320px',
                height: '80px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '0px',
                height: '400px',
                leftMargin: '50px',
                width: '100%'
            }]
        });
        
       
        //  Create File space explanation
        new HighlightCodeHelper({
            keyElt: 'create-file',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                top: '0px',
                height: '120px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '110px',
                height: '80px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '170px',
                height: '290px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '500px',
                height: '150px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '0px',
                height: '700px',
                leftMargin: '50px',
                width: '100%'
            }]
        });
        
       
        //  Write File space explanation
        new HighlightCodeHelper({
            keyElt: 'write-file',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                top: '0px',
                height: '190px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '180px',
                height: '120px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '300px',
                height: '120px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '0',
                height: '500px',
                leftMargin: '50px',
                width: '100%'
            }]
        });
        
       
        //  Contact Picker File explanation
        new HighlightCodeHelper({
            keyElt: 'contact',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                top: '0px',
                height: '190px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '180px',
                height: '90px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '350px',
                height: '110px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '0',
                height: '600px',
                leftMargin: '50px',
                width: '100%'
            }]
        });
        
       
        //  NFC Read Tag
        new HighlightCodeHelper({
            keyElt: 'read-tag',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                top: '0px',
                height: '190px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '180px',
                height: '60px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '220px',
                height: '150px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '0',
                height: '600px',
                leftMargin: '50px',
                width: '100%'
            }]
        });
        
       
        //  NFC Write Tag
        new HighlightCodeHelper({
            keyElt: 'write-tag',
            // We start with the first fragment (the initial position is fixed by css)
            positionArray: [{
                top: '0px',
                height: '110px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '110px',
                height: '170px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '330px',
                height: '150px',
                leftMargin: '50px',
                width: '100%'
            }, {
                top: '0',
                height: '600px',
                leftMargin: '50px',
                width: '100%'
            }]
        });
        
       

    }
}