'use strict';
import {
    ApplyCss
} from './helper/applyCss.js';
import {
    ApplyCodeMiror
} from './helper/applyJs.js';
import {Noise} from './houdini/noise.js';

export class Demos {

    constructor() {
        try {

            this._demoPaintApi();
            this.frame = 0;

        } catch (error) {
            console.error(error);
        }

    }

    _demoPaintApi() {
        //(CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-worklet.js');
        //(CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/noise-worklet.js');

        new Noise();
        //requestAnimationFrame(this._frameIncrement.bind(this));
    }

    _frameIncrement(){
        if (this.frame === 9) {
            this.frame = 0;
        } else {
            this.frame++;
        }
        document.getElementById('noise').style.setProperty('--frame', this.frame);
        requestAnimationFrame(this._frameIncrement.bind(this));
    }

}