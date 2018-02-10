'use stict'

export class ApplyCss {

    /**
     *
     * @param {HtmlElement} elt
     * @param {string} initialContent
     */
    constructor(elt, initialContent) {
        const codeMirrorCss = CodeMirror(elt, {
            value: initialContent,
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
                .split('}')
                .map(str => str.trim())
                .forEach(selectorCss => {
                    const [selector, properties] = selectorCss.split('{').map(str => str.trim());
                    if (selector &&
                        selector.length > 0 &&
                        document.querySelector(selector)) {
                        properties.split(';')
                            .map(str => str.trim())
                            .forEach(cssInstruction => {
                                try {
                                    const [key, value] = cssInstruction.split(':').map(keyValue => keyValue.trim());
                                    if (key.startsWith('--')) {
                                        document.querySelector(selector).style.setProperty(key, value);
                                    } else {
                                        document.querySelector(selector).style[key] = value;
                                    }
                                } catch (e) {}
                            });
                    }
                });
        });
    }
}