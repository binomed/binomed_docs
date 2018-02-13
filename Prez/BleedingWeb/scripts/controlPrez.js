'use strict'
import {
    Thingy
} from './libs/thingy.js';

export class ControlPrez {
    constructor() {
        this.thingyConnected = false;

        Reveal.addEventListener('slidechanged', this.thingyControl.bind(this));
    }

    async thingyControl() {
        try {
            if (this.thingyConnected) {
                return;
            }
            const thingy = new Thingy({
                logEnabled: true
            });
            await thingy.connect();
            this.thingyConnected = true;
            await thingy.buttonEnable((state) => {
                console.log('tap', state);
                if (state) {
                    Reveal.next();
                }
            }, true);


        } catch (error) {
            console.error(error);
        }
    }
}