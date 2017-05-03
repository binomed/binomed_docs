'use strict'

const MIN_TOP = '90px';
const LINE_HEIGHT = '1.15em';
const ADDITIONNAL_HEIGHT = '0.4em';
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
            let properties = null
            if (event.type === 'fragmentshown') {
                const index = +event.fragment.getAttribute('data-fragment-index');
                properties = this.positionArray[index];

            } else {
                const index = +event.fragment.getAttribute('data-fragment-index');
                // On reset les properties
                if (index > 0) {
                    properties = this.positionArray[index - 1];
                }
            }
            const keys = Object.keys(properties);
            const area = {};
            const position = {};
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                switch (true) {
                    case key === 'line':
                    case key === 'nbLines':
                    case key === 'col':
                    case key === 'nbCols':
                    case key === 'topMargin':
                    case key === 'leftMargin':
                        position[key] = properties[key];
                        break;
                    case key === 'height':
                    case key === 'width':
                    case key === 'top':
                    case key === 'left':
                        area[key] = properties[key];
                        break;
                    default:
                }

            }

            if (position.topMargin === undefined) {
                position.topMargin = MIN_TOP;
            }
            if (position.nbLines === undefined && area.height === undefined) {
                area.height = LINE_HEIGHT;
            }
            if (position.line === undefined && area.top === undefined) {
                area.top = 0;
            }
            if (position.nbCols === undefined && area.width === undefined) {
                area.width = 0;
            }
            if (position.col === undefined && area.left === undefined) {
                area.left = 0;
            }
            this.eltHiglight.area = area;
            this.eltHiglight.position = position;

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