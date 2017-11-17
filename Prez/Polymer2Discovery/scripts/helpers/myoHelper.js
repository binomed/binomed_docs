export class MyoHelper{
	constructor(){

		this.timerLock = null;
		this.innerLock = true;

		if(Myo){
			Myo.connect('jef.polymer.prez');


			Myo.on('status', (data) => {
				console.log('MyoStatus', data);
				Myo.setLockingPolicy("none");
			});

			//Whenever we get a pose event, we'll update the image sources with the active version of the image
			Myo.on('pose', (pose) => {
				console.log('Pose', pose);
				const timeoutFunction = () => {
					this.innerLock = true;
					console.log('lock');
					Myo.myos[0].lock();
					Myo.myos[0].vibrate();
				}
				switch(pose){
					case 'double_tap':
						if (this.innerLock){
							this.innerLock = false;
							console.log('unlock');
							Myo.myos[0].vibrate();
							Myo.myos[0].unlock();
							this.timerLock = setTimeout(timeoutFunction,5000);
						}else{
							this._emulateKey('next');
							clearTimeout(this.timerLock);
							this.timerLock = setTimeout(timeoutFunction,5000);

						}
						break;
					/*case 'wave_in':
						if (!this.innerLock){
							this._emulateKey('left');
							clearTimeout(this.timerLock);
							this.timerLock = setTimeout(timeoutFunction,5000);
						}
						break;
					case 'wave_out':
						if (!this.innerLock){
							this._emulateKey('right');
							clearTimeout(this.timerLock);
							this.timerLock = setTimeout(timeoutFunction,5000);
						}
						break;*/
					/*case 'fingers_spread':
						if (!this.innerLock){
							this._emulateKey('prev');
							clearTimeout(this.timerLock);
							this.timerLock = setTimeout(timeoutFunction,5000);
						}
						break;*/
					case 'fist':
						clearTimeout(this.timerLock);
						this.innerLock = true;
						console.log('lock');
						Myo.myos[0].lock();
						Myo.myos[0].vibrate();
				}
				//$('img.' + pose).attr('src', 'img/' + pose + '_active.png');
				//$('.mainPose img').attr('src', 'img/' + pose + '_active.png');
			})

			//Whenever a myo locks we'll switch the main image to a lock image
			Myo.on('locked', () => {
				console.log('locked')
				//$('.mainPose img').attr('src', 'img/locked.png');
			});

			//Whenever a myo unlocks we'll switch the main image to a unlock image
			Myo.on('unlocked', () =>{
				console.log('unlocked');
				//$('.mainPose img').attr('src', 'img/unlocked.png');
			});
		}
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