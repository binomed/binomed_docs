'use strict';
import {
    ApplyCss
} from './helper/applyCss.js';
import {
    ApplyCodeMiror
} from './helper/applyJs.js';
import {AnimationHeader} from './houdini/animation-header.js'

export class Demos {

    constructor() {
        try {

            this._demoTypeOM();
            this._demoPaintApi();
            this._demoPaintApiJsInCss();
            this._demoCssVar();
            this._demoPropertiesAndValues();
            this.animationDemoLoad = false;
            Reveal.addEventListener('animationDemoState', () =>{
                if (!this.animationDemoLoad){
                    new AnimationHeader();
                }
            })
            this.layoutDemoLoad = false;
            this._demoLayoutApi();
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
            inherits: false,
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

    _demoPaintApi() {
        if (!'paintWorklet' in CSS){
            return;
        }

        (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-worklet.js');

        new ApplyCss(
            document.getElementById('codemirror-paint-api-css'),
            `#render-element-paint-api {
    --circle-color: black;
    --width-circle: 100px;
    width: var(--width-circle);
    background-image: paint(circle, 0px, red);
}
.reveal section.parent-demo-paint.cadre{
    --cadre-color:black;
}`
        );

        new ApplyCodeMiror(document.getElementById('codemirror-paint-api'),
            'javascript',
            `paint(ctx, geom, properties, args) {
    // Determine the center point and radius.
    const radius = Math.min(geom.width / 2, geom.height / 2);
    const border = args[0].value;
    // Change the border color.
    ctx.fillStyle = args[1].toString();
    ctx.arc(geom.width - border / 2, geom.height -  - border / 2, radius - border, 0, 2 * Math.PI);
    // Change the fill color.
    const color = properties.get('--circle-color').toString();
    ctx.fillStyle = color;
    ctx.arc(geom.width / 2, geom.height / 2, radius, 0, 2 * Math.PI);
}`);
    }

    _demoPaintApiJsInCss() {
        if (!'paintWorklet' in CSS){
            return;
        }

        (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-from-css-worklet.js');

        new ApplyCss(
            document.getElementById('codemirror-paint-api-js-in-css'),
            `#render-element-paint-api-js-in-css {
    --circle-color: black;
    --width-circle: 100px;
    width: var(--width-circle);
    background-image: paint(circle-from-css);
    --circle-js-in-css: (ctx, geom) => {
        const color = \`var(--circle-color)\`;
        ctx.fillStyle = color;
        const x = geom.width / 2;
        const y = geom.height / 2;
        let radius = Math.min(x, y);
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}`,
true);
    }

    _demoLayoutApi(){
        document.querySelectorAll('#demoLayoutWorklet div').forEach(elem => {
            const t = elem.textContent;
            // Cut out a random amount of text, but keep at least 10 characters
            elem.textContent = t.slice(0, Math.floor(Math.random() * (t.length - 10) + 10));
        })
        CSS.layoutWorklet.addModule('./scripts/houdini/masonry-worklet.js');

        let cols = 3;
        document.querySelector('#demoMasonryBtnMinus').addEventListener('click', ()=>{
            cols = Math.max(3, cols - 1);
            document.querySelector('#demoMasonryCols').innerHTML = cols;
            document.querySelector('#demoLayoutWorklet').style.setProperty('--masonry-columns', cols);
        });
        document.querySelector('#demoMasonryBtnPlus').addEventListener('click', ()=>{
            cols = Math.min(8, cols + 1);
            document.querySelector('#demoMasonryCols').innerHTML = cols;
            document.querySelector('#demoLayoutWorklet').style.setProperty('--masonry-columns', cols);
        });
    }

}