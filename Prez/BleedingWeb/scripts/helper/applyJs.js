'use stict'

export class ApplyCodeMiror {

    /**
     *
     * @param {HtmlElement} elt
     * @param {string} mode
     * @param {string} initialContent
     */
    constructor(elt, mode, initialContent) {
        const codeMirrorJS = CodeMirror(elt, {
            value: initialContent,
            mode: mode,
            lineNumber: 'true',
            fixedGutter: false,
            readOnly: true,
            showCursorWhenSelecting: true,
            lineWrapping: true,
            scrollbarStyle: 'null',
            theme: 'solarized dark'
        });

        codeMirrorJS.setSize('100%', '100%');
    }

}