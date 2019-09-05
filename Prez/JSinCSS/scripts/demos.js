'use strict';
import {
    ApplyCss
} from './helper/applyCss.js';
import { HelperJsInCss} from './helper/HelperJSInCSS.js'

export class Demos {

    constructor() {
        try {

            this._demoCssVar();
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



}