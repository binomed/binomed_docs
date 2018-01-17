'use strict';

export class DebugHelper {
    constructor() {
        console.log('Hello DebugHelper');
        Reveal.addEventListener('inline', this.inline.bind(this));
        Reveal.addEventListener('ghost', this.ghost.bind(this));

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

    ghost() {
        let processEvent = true;
        /*Reveal.addEventListener('slidechanged', () =>{

        })*/
    }

}