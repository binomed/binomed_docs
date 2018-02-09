'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';


(async function () {


    async function pageLoad() {


        try {

            const codeMirrorCss = CodeMirror(document.getElementById('codemirror-css'), {
                value: `--a-super-var : #00000;`,
                mode: 'css',
                lineNumber: 'true',
                fixedGutter: false,
                showCursorWhenSelecting: true,
                lineWrapping: true,
                scrollbarStyle: 'null',
                theme: 'solarized dark'
            });
            codeMirrorCss.setSize('100%', '100%');
            codeMirrorCss.on('change', (...obj) => {
                codeMirrorCss.getValue()
                    .split(';')
                    .map(instruction => instruction.trim())
                    .forEach(cssInstruction => {
                        try {
                            const [key, value] = cssInstruction.split(':').map(keyValue => keyValue.trim());
                            if (key.startsWith('--')) {
                                document.getElementById('render-element').style.setProperty(key, value);
                            } else {
                                document.getElementById('render-element').style[key] = value;
                            }
                        } catch (e) {}
                    });
            });
        } catch (error) {
            console.error(error);
        }


    }


    window.addEventListener('load', pageLoad);
})();