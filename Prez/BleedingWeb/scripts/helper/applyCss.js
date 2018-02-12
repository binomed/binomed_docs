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

        const head = document.head || document.getElementsByTagName('head')[0];
        this.style = document.createElement('style');
        this.nbElts = 0;

        this.style.type = 'text/css';
        if (this.style.styleSheet){
            this.style.styleSheet.cssText = '';
        } else {
            this.style.appendChild(document.createTextNode(''));
        }
        head.appendChild(this.style);

        codeMirrorCss.setSize('100%', '100%');
        codeMirrorCss.on('change', (...obj) => {
            this.applyCss(codeMirrorCss.getValue());
        });
        this.applyCss(initialContent);
    }

    applyCss(value){
        for (let i = 0; i < this.nbElts; i++){
            this.style.sheet.deleteRule(0);
        }
        this.nbElts = 0;
        value.split('}')
            .map(str => str.trim())
            .forEach(selectorCss => {
                try{
                    this.style.sheet.insertRule(selectorCss+'}');
                    this.nbElts++;
                }catch(e){console.error(e);}
            });

    }
}