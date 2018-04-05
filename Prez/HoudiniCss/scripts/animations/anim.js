'use strict'
export class Animations {
	constructor() {
		this._browserEngine();
	}

	_browserEngine() {
		let stepAnimation = 0;
		const STEP_DOWNLOAD = 1;
		const STEP_PROCESS = 2;

		function fragmentAnimation(){
			stepAnimation++;
			switch(stepAnimation){
				case(STEP_DOWNLOAD):{
					document.getElementById('svg-cloud').classList.add('html');
					document.getElementById('svg-html').classList.add('html');
					break;
				}
				case(STEP_PROCESS):{
					document.getElementById('svg-cloud').classList.remove('html');
					document.getElementById('svg-html').classList.remove('html');
					document.getElementById('svg-html').classList.add('process');
					document.getElementById('svg-process').classList.add('process');
					document.getElementById('svg-objects').classList.add('process');
					document.getElementById('svg-css-objects').classList.add('process');
					break;
				}
			}
		}

		Reveal.addEventListener('browser-engine', ()=>{
			Reveal.addEventListener('fragmentshown', fragmentAnimation);
			stepAnimation = 0;

			function clearAnim(){
				Reveal.removeEventListener('fragmentshown', fragmentAnimation);
				Reveal.removeEventListener('slidechanged', clearAnim);
				document.getElementById('svg-cloud').classList.remove('html');
				document.getElementById('svg-html').classList.remove('html');
				document.getElementById('svg-process').classList.remove('process');
				document.getElementById('svg-html').classList.remove('process');
				document.getElementById('svg-objects').classList.remove('process');
				document.getElementById('svg-css-objects').classList.remove('process');
			}

			setTimeout(()=>{
				Reveal.addEventListener('slidechanged', clearAnim);
			},100);
		});

	}
}