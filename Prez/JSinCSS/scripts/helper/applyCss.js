'use stict'

export class ApplyCss {

    /**
     *
     * @param {HtmlElement} elt
     * @param {string} initialContent
     * @param {boolean} noTrim
     */
    constructor(elt, initialContent, noTrim = false, jsInCssHelpers) {
        this.codeMirrorCss = CodeMirror(elt, {
            value: initialContent,
            mode: 'css',
            lineNumbers: true,
            autoRefresh: true,
            fixedGutter: false,
            showCursorWhenSelecting: true,
            lineWrapping: true,
            scrollbarStyle: 'null',
            theme: 'idea'
        });

        const head = document.head || document.getElementsByTagName('head')[0];
        this.style = document.createElement('style');
        this.nbElts = 0;
        this.noTrim = noTrim;

        this.style.type = 'text/css';
        if (this.style.styleSheet) {
            this.style.styleSheet.cssText = '';
        } else {
            this.style.appendChild(document.createTextNode(''));
        }
        head.appendChild(this.style);

        this.codeMirrorCss.setSize('100%', '100%');
        this.codeMirrorCss.on('change', (...obj) => {
            this.applyCss(this.codeMirrorCss.getValue());
            if (jsInCssHelpers && jsInCssHelpers.length > 0){
                jsInCssHelpers.forEach(jsInCssHelper => jsInCssHelper.checkElements())
            }
        });
        this.applyCss(initialContent);
    }

    applyCss(value) {
        for (let i = 0; i < this.nbElts; i++) {
            this.style.sheet.deleteRule(0);
        }
        this.nbElts = 0;
        if (!this.noTrim){
            value.split('}\n')
                .map(str => str.trim())
                .forEach(selectorCss => {
                    try {
                        this.style.sheet.insertRule(selectorCss + '}');
                        this.nbElts++;
                    } catch (e) {
                        console.error(e);
                    }
                });
        }else{
            try {
                this.style.sheet.insertRule(value);
                this.nbElts++;
            } catch (e) {
                console.error(e);
            }
        }

    }
}