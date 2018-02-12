'use stict'

export class ApplyJS {

    /**
     *
     * @param {HtmlElement} elt
     * @param {string} initialContent
     */
    constructor(elt, initialContent) {
        const codeMirrorJS = CodeMirror(elt, {
            value: initialContent,
            mode: 'javascript',
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