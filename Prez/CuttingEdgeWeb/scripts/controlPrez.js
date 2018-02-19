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
            const battery = await thingy.getBatteryLevel();
            const permission = await Notification.requestPermission();
            if (permission === "denied") {
                console.log(`Thingy Connect and level battery : ${battery}`);
            } else {
                console.log(`Thingy Connect and level battery : ${battery}`, battery);
                new Notification("Thingy Connect ! ", {
                    body: ` Thingy Connect and level battery : ${battery}`
                });
            }
            const state = await thingy.buttonEnable((state) => {
                console.log('tap', state);
                if (state) {
                    Reveal.next();
                }
            }, true);
            console.log(state);


        } catch (error) {
            console.error(error);
        }
    }
}