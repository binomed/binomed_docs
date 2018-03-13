/*const noise = () => {
    let canvas, ctx;

    let wWidth, wHeight;

    let noiseData = [];
    let frame = 0;

    let loopTimeout;


    // Create Noise
    const createNoise = () => {
        const idata = ctx.createImageData(wWidth, wHeight);
        const buffer32 = new Uint32Array(idata.data.buffer);
        const len = buffer32.length;

        for (let i = 0; i < len; i++) {
            if (Math.random() < 0.5) {
                buffer32[i] = 0xff000000;
            }
        }

        noiseData.push(idata);
    };


    // Play Noise
    const paintNoise = () => {
        if (frame === 9) {
            frame = 0;
        } else {
            frame++;
        }

        ctx.putImageData(noiseData[frame], 0, 0);
    };


    // Loop
    const loop = () => {
        paintNoise(frame);

        loopTimeout = window.setTimeout(() => {
            window.requestAnimationFrame(loop);
        }, (1000 / 25));
    };


    // Setup
    const setup = () => {
        wWidth = window.innerWidth;
        wHeight = window.innerHeight;

        canvas.width = wWidth;
        canvas.height = wHeight;

        for (let i = 0; i < 10; i++) {
            createNoise();
        }

        loop();
    };


    // Init
    const init = (() => {
        canvas = document.getElementById('noise');
        ctx = canvas.getContext('2d');

        setup();
    })();
};

noise();*/

registerPaint('noise', class {

	static get inputProperties() {
        return ['--frame'];
    }

	constructor(){
		console.log('Noise Construct')
		this.noiseData = [];
		this.frame = 0;
		this.noiseCreated = false;
	}

	createNoise(ctx, geom){
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0, geom.width, geom.height);
        // const idata = ctx.createImageData(geom.width, geom.height);
        const buffer32 = new Uint32Array(idata.data.buffer);
        const len = buffer32.length;

        for (let i = 0; i < len; i++) {
            if (Math.random() < 0.5) {
                buffer32[i] = 0xff000000;
            }
        }

        this.noiseData.push(idata);
    };

	paint(ctx, geom, properties) {
		console.log('paint');
		if (!this.noiseCreated){
			console.log('create noise');
			for (let i = 0; i < 10; i++) {
				this.noiseCreated = true;
				this.createNoise(ctx, geom);
			}
		}

		/*if (frame === 9) {
            frame = 0;
        } else {
            frame++;
        }*/

        ctx.putImageData(this.noiseData[properties.get('--frame')], 0, 0);
	}
});