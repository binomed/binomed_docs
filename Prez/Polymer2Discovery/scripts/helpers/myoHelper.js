export class MyoHelper{
	constructor(){

		this.timerLock = null;
		this.innerLock = true;
		this.timeFist = 0;
		this.intervalWaveIn = null;

		if(Myo){
			Myo.connect('jef.polymer.prez');


			Myo.on('status', (data) => {
				console.log('MyoStatus', data);
				Myo.setLockingPolicy("none");
			});

			//Whenever we get a pose event, we'll update the image sources with the active version of the image
			Myo.on('pose', (pose) => {
				console.log('Pose', pose);
				switch(pose){
					case 'double_tap':
						if (!this.innerLock){
							this._emulateKey('next');
							clearTimeout(this.timerLock);
							this.timerLock = setTimeout(this._timeoutFunction.bind(this),5000);
						}
						break;
					case 'wave_int':
						if (!this.innerLock){
							this.intervalWaveIn = setInterval(this._intervalBackWard.bind(this, 1000));
						}
						break;
					case 'fist':
						this.timeFist = Date.now();
				}
			});

			Myo.on('pose_off', (pose) =>{
				console.log('pose_off', pose);
				console.log('timeFist', this.timeFist, Date.now() - this.timeFist);
				console.log(this.innerLock);
				if (pose === 'fist'
					&& Date.now() - this.timeFist > 1000
					&& this.innerLock){
						this.innerLock = false;
						console.log('unlock');
						Myo.myos[0].vibrate();
						Myo.myos[0].unlock();
						this.timerLock = setTimeout(this._timeoutFunction.bind(this),5000);
				}else if (pose === 'wave_in'){
					clearInterval(this.intervalWaveIn);
				}

			})

			//Whenever a myo locks we'll switch the main image to a lock image
			Myo.on('locked', () => {
				console.log('locked')
			});

			//Whenever a myo unlocks we'll switch the main image to a unlock image
			Myo.on('unlocked', () =>{
				console.log('unlocked');
			});
		}
	}

	_timeoutFunction(){
		this.innerLock = true;
		console.log('lock');
		Myo.myos[0].lock();
		Myo.myos[0].vibrate();
	}

	_intervalBackWard(){
		this._emulateKey('left');
		clearTimeout(this.timerLock);
		this.timerLock = setTimeout(this._timeoutFunction.bind(this),5000);
	}

	_emulateKey(key){
		const event = new Event('keydown', {bubbles: true,
			cancelable: false
			});
		switch(key){
			case 'prev':
				event.keyCode = 33; //page up
				event.which = 33;
				break;
			case 'next':
				event.keyCode = 34; // page down
				event.which = 34;
				break;
			case 'right':
				event.keyCode = 39; // right
				event.which = 39;
				break;
			case 'left':
				event.keyCode = 37; //left
				event.which = 37;
				break;
		}

		document.dispatchEvent(event);
	}
}