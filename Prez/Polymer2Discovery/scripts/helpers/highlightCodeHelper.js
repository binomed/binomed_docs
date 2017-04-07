'use strict'

const LINE_HEIGHT = 1.15;
const ADDITIONNAL_HEIGHT = 0.4;
const COL_WIDTH = 35;

export class HighlightCodeHelper {
    constructor({
        keyElt,
        positionArray
    }) {
        this.eltHiglight = document.getElementById(`highlight-${keyElt}`);
        this.positionArray = positionArray;

        Reveal.addEventListener(`code-${keyElt}`, this._listenFragments.bind(this));
        Reveal.addEventListener(`stop-code-${keyElt}`, this._unregisterFragments.bind(this));
    }

    _progressFragment(event) {
        try {
            if (event.type === 'fragmentshown') {
                const index = +event.fragment.getAttribute('data-fragment-index');
                const properties = this.positionArray[index];
                const keys = Object.keys(properties);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (key === 'row') {
                        this.eltHiglight.style['top'] = `calc(90px + (${properties[key]} * ${LINE_HEIGHT}em))`;
                    } else if (key === 'col') {
                        this.eltHiglight.style['left'] = `calc(60px + (${properties[key]} * ${COL_WIDTH}px))`;
                    } else if (key === 'calcHeight') {
                        this.eltHiglight.style['height'] = `calc(${properties[key]}em + ${ADDITIONNAL_HEIGHT}em)`;
                    } else {
                        this.eltHiglight.style[key] = properties[key];
                    }
                }
            } else {
                const index = +event.fragment.getAttribute('data-fragment-index');
                // On reset les properties
                let properties = this.positionArray[index];
                let keys = Object.keys(properties);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (key === 'row') {
                        this.eltHiglight.style['top'] = '';
                    } else if (key === 'calcHeight') {
                        this.eltHiglight.style['height'] = '';
                    } else if (key === 'col') {
                        this.eltHiglight.style['left'] = '';
                    } else {
                        this.eltHiglight.style[key] = '';
                    }
                }
                if (index > 0) {
                    properties = this.positionArray[index - 1];
                    keys = Object.keys(properties);
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        if (key === 'row') {
                            this.eltHiglight.style['top'] = `calc(90px + (${properties[key]} * ${LINE_HEIGHT}em))`;
                        } else if (key === 'col') {
                            this.eltHiglight.style['left'] = `calc(60px + (${properties[key]} * ${COL_WIDTH}px))`;
                        } else if (key === 'calcHeight') {
                            this.eltHiglight.style['height'] = `calc(${properties[key]}em + ${ADDITIONNAL_HEIGHT}em)`;
                        } else {
                            this.eltHiglight.style[key] = properties[key];
                        }
                    }
                }
            }
        } catch (e) {}
    }

    _listenFragments() {
        Reveal.addEventListener('fragmentshown', this._progressFragment.bind(this));
        Reveal.addEventListener('fragmenthidden', this._progressFragment.bind(this));
    }

    _unregisterFragments() {
        Reveal.removeEventListener('fragmentshown', this._progressFragment.bind(this));
        Reveal.removeEventListener('fragmenthidden', this._progressFragment.bind(this));
    }


}