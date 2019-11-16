'use strict';
import {
    ApplyCss
} from './helper/applyCss.js';
import { HelperJsInCss} from './helper/HelperJSInCSS.js'

export class Demos {

    constructor() {
        try {

            this._demoCssVar();
            this._demoRandomColor();
            this._demoDependancy();
            this._demoArgs();
            this._demoPaintApiJsInCss();
        } catch (error) {
            console.error(error);
        }

    }

    _demoCssVar() {

        const helperColor = new HelperJsInCss(document.body.querySelector('#pure-css'), "--randomColor");
        const helperDependancy = new HelperJsInCss(document.body.querySelector('#pure-css h1'), "--dependancy", false);

        const helperBg1 = new HelperJsInCss(document.getElementById('bg1'), '--url', false, ['--imgToUse']);
        const helperBg2 = new HelperJsInCss(document.getElementById('bg2'), '--url', false, ['--imgToUse']);

        /** */
        new ApplyCss(
            document.getElementById('codemirror-css'),
            `:root{
    --codemiror-size: 30px;
}
#pure-css{
    background: var(--computeRandomColor);
}
#pure-css h1 {
    color: var(--computeDependancy);
}
#pure-css .bg{
    background-image:var(--computeUrl);
}
#pure-css #bg1 {
    --imgToUse: var(--img1);
}
#pure-css #bg2 {
    --imgToUse: var(--img2);
}`,
false,
[helperColor, helperDependancy, helperBg1, helperBg2]
        );
    }

    _demoRandomColor() {

        const helperColor = new HelperJsInCss(document.body.querySelector('#random-color-css'), "--randomColor");
        /** */
        new ApplyCss(
            document.getElementById('codemirror-random'),
            `:root{
    --codemiror-size: 30px;
}
#random-color-css{
    --randomColor: () => {
        let red = Math.random()*255;
        let green = Math.random()*255;
        let blue = Math.random()*255;
        return \`rgb(\${red},\${green},\${blue})\`;
    };
    background: var(--computeRandomColor);
}
`,
false,
[helperColor]
        );
    }


    _demoDependancy() {

        const helperDependancy = new HelperJsInCss(document.body.querySelector('#dependancy-css h1'), "--dependancy", false);


        /** */
        new ApplyCss(
            document.getElementById('codemirror-dependancy'),
            `:root{
    --codemiror-size: 30px;
}
#dependancy-css h1 {
    --color:blue;
    --dependancy : () => \`var(--color)\`;
    color: var(--computeDependancy);
}
`,
false,
[helperDependancy]
        );
    }

    _demoArgs() {

        
        const helperBg1 = new HelperJsInCss(document.getElementById('bg1-args'), '--url', false, ['--imgToUse']);
        const helperBg2 = new HelperJsInCss(document.getElementById('bg2-args'), '--url', false, ['--imgToUse']);

        /** */
        new ApplyCss(
            document.getElementById('codemirror-args'),
            `:root{
    --prefix: http://localhost:3000/assets/images;
    --img1: hack1.jpg;
    --img2: hack2.jpg;
}
#args-css .bg{
    --url: (img) => {
        let prefix = \`var(--prefix)\`;
        let urlConcat = prefix+'/'+img;
        return "url("+urlConcat.split(' ').join('')+")";
    };
    background-image:var(--computeUrl);
}
#args-css #bg1-args {
    --imgToUse: var(--img1);
}
#args-css #bg2-args {
    --imgToUse: var(--img2);
}`,
false,
[helperBg1, helperBg2]
        );
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
    --circle: (ctx, geom) => {
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




}