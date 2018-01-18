'use strict';

export class DebugHelper {
    constructor() {
        this.indiceH = -1;
        this.subscribe = false;
        this.ghostParent = document.getElementById('demo-ghost-parent');
        console.log('Hello DebugHelper');
        Reveal.addEventListener('inline', this.inline.bind(this));
        Reveal.addEventListener('ghost', this.ghost.bind(this));
        Reveal.addEventListener('slidechanged', (event) => {
            if (this.subscribe && this.indiceH != event.indexh) {
                document.removeEventListener('mousemove', this.processMouse);
            }
        });

        document.getElementById('demo-click').addEventListener('click', this.clickMe.bind(this));
    }

    inline() {
        const personList = [{
            first: 'John',
            last: 'Doe',
            age: 25
        }, {
            first: 'Jane',
            last: 'Doe',
            age: 25
        }, {
            first: 'Jean-François',
            last: 'Garreau',
            age: 34
        }, {
            first: 'Julien',
            last: 'Landure',
            age: 34
        }];

        const namesOlders = personList
            .filter((person) => person.age > 30)
            .map((person) => {
                return {
                    name: `${person.first} ${person.last}`
                }
            });

        console.table(namesOlders);
    }


    clickMe() {
        const clickElt = document.getElementById('demo-click');
        if (clickElt.classList.contains('rainbow')) {
            return;
        }
        clickElt.classList.add('rainbow');
        clickElt.innerHTML = 'Whhooot';
    }

    ghost(event) {
        this.subscribe = true;
        this.indiceH = Reveal.getIndices().h;
        this.width = document.body.getBoundingClientRect().width
        document.addEventListener('mousemove', this.processMouse.bind(this));
        /*Reveal.addEventListener('slidechanged', () =>{

        })*/
    }

    processMouse(event) {
        const deltaX = this.width - event.clientX;
        const median = this.width / 2;
        const left = event.clientX > median ? (event.clientX - median) : -1 * (median - event.clientX);
        this.ghostParent.style.setProperty('--left-pos', `${left}px`)
    }

}