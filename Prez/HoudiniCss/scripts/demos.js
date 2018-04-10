'use strict';
import {
    ApplyCss
} from './helper/applyCss.js';
import {
    ApplyCodeMiror
} from './helper/applyJs.js';

export class Demos {

    constructor() {
        try {

            this._demoTypeOM();
            this._demoPaintApi();
            this._demoCssVar();
            this._demoPropertiesAndValues();
            this.frame = 0;

        } catch (error) {
            console.error(error);
        }

    }

    _demoTypeOM() {
        if (!window.CSSTransformValue){
            return;
        }
        const transform = //new CSSTransformValue([
            new CSSRotate(0,0,1, CSS.deg(0))
        //]);
        const square = document.querySelector('#squareDemo');
        square.attributeStyleMap.set('transform', transform);
        let rafId;
        let stopAnimation = false;
        function draw(){
            transform.angle.value = (transform.angle.value + 5) % 360;
            square.attributeStyleMap.set('transform', transform);
            rafId = requestAnimationFrame(draw);
        }
        square.addEventListener('mouseenter', () => draw());
        square.addEventListener('mouseleave', () => cancelAnimationFrame(rafId));
    }

    _demoCssVar() {
        /** */
        new ApplyCss(
            document.getElementById('codemirror-css'),
            `#render-element h2{
    --a-super-var: #FFF;
}
#render-element .text-1{

}
#render-element .text-2{

}`
        );
    }

    _demoPaintApi() {
        //(CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-worklet.js');
        //(CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/noise-worklet.js');


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

    _demoPropertiesAndValues() {
        CSS.registerProperty({
            name: '--properties-move-register',
            syntax: '<length>',
            initialValue: '0px',
        });
        document.querySelector('#btn-square-properties').addEventListener('click', ()=>{
            document.querySelector('#square-properties').classList.remove('move');
            document.querySelector('#square-properties').classList.add('move');
        });
        document.querySelector('#btn-square-no-properties').addEventListener('click', ()=>{
            document.querySelector('#square-no-properties').classList.remove('move');
            document.querySelector('#square-no-properties').classList.add('move');
        });
    }

}