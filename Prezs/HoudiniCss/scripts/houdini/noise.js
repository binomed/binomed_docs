export class Noise {
	constructor(){
		this.canvas;
		this.ctx;
		this.wWidth;
		this.wHeight;
		this.noiseData = [];
		this.frame = 0;
		this.loopTimeout;

		this.init();
	}

	// Create Noise
    createNoise() {
        const idata = this.ctx.createImageData(this.wWidth, this.wHeight);
        const buffer32 = new Uint32Array(idata.data.buffer);
        const len = buffer32.length;

        for (let i = 0; i < len; i++) {
            if (Math.random() < 0.5) {
                buffer32[i] = 0xff000000;
            }
        }

        this.noiseData.push(idata);
    };


    // Play Noise
    paintNoise() {
        if (this.frame === 9) {
            this.frame = 0;
        } else {
            this.frame++;
        }

        this.ctx.putImageData(this.noiseData[this.frame], 0, 0);
    };


    // Loop
    loop() {
        this.paintNoise(this.frame);

        this.loopTimeout = window.setTimeout(() => {
            window.requestAnimationFrame(this.loop.bind(this));
        }, (1000 / 25));
    };


    // Setup
    setup() {
        this.wWidth = window.innerWidth;
        this.wHeight = window.innerHeight;

        this.canvas.width = this.wWidth;
        this.canvas.height = this.wHeight;

        for (let i = 0; i < 10; i++) {
            this.createNoise();
        }

        this.loop();
    };


    // Init
    init() {
        this.canvas = document.getElementById('noise');
        this.ctx = this.canvas.getContext('2d');

        this.setup();
    };
}
