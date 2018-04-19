'use strict'
export class Animations {
	constructor() {
		this._browserEngine();

		this._animateHoudini();
	}

	_browserEngine() {
		let stepAnimation = 0;
		const STEP_DOWNLOAD = 1;
		const STEP_PROCESS = 2;
		const STEP_BROWSER = 3;
		const STEP_LAYOUT = 4;
		const STEP_PAINT = 5;

		function fragmentAnimation(){
			stepAnimation++;
			switch(stepAnimation){
				case(STEP_DOWNLOAD):{
					document.getElementById('svg-cloud').classList.add('html');
					document.getElementById('svg-html').classList.add('html');
					document.getElementById('title-download').classList.add('html');
					break;
				}
				case(STEP_PROCESS):{
					document.getElementById('title-download').classList.remove('html');
					document.getElementById('svg-cloud').classList.remove('html');
					document.getElementById('svg-html').classList.remove('html');
					document.getElementById('title-parsing').classList.add('process');
					document.getElementById('svg-html').classList.add('process');
					document.getElementById('svg-process').classList.add('process');
					document.getElementById('svg-objects').classList.add('process');
					document.getElementById('svg-css-objects').classList.add('process');
					break;
				}
				case(STEP_BROWSER):{
					document.getElementById('title-parsing').classList.remove('process');
					document.getElementById('svg-html').classList.remove('process');
					document.getElementById('svg-process').classList.remove('process');
					document.getElementById('svg-objects').classList.remove('process');
					document.getElementById('svg-css-objects').classList.remove('process');
					document.getElementById('svg-browser').classList.add('render');
					document.getElementById('svg-objects').classList.add('render');
					document.getElementById('svg-css-objects').classList.add('render');
					document.getElementById('svg-browser-layout').classList.add('render');
					break;
				}
				case(STEP_LAYOUT):{
					document.getElementById('svg-browser-layout').classList.remove('render');
					document.getElementById('title-layout').classList.add('render-layout');
					document.getElementById('svg-browser-layout').classList.add('render-layout');
					break;
				}
				case(STEP_PAINT):{
					document.getElementById('title-layout').classList.remove('render-layout');
					document.getElementById('svg-browser-layout').classList.remove('render-layout');
					document.getElementById('title-paint').classList.add('render-paint');
					document.getElementById('svg-browser-layout').classList.add('render-paint');
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
				document.getElementById('title-download').classList.remove('html');
				document.getElementById('svg-process').classList.remove('process');
				document.getElementById('svg-html').classList.remove('process');
				document.getElementById('svg-objects').classList.remove('process');
				document.getElementById('svg-css-objects').classList.remove('process');
				document.getElementById('title-parsing').classList.remove('process');
				document.getElementById('title-parsing').classList.remove('process');
				document.getElementById('svg-objects').classList.remove('render');
				document.getElementById('svg-css-objects').classList.remove('render');
				document.getElementById('svg-browser-layout').classList.remove('render');
				document.getElementById('svg-browser').classList.remove('render');
				document.getElementById('title-layout').classList.remove('render-layout');
				document.getElementById('svg-browser-layout').classList.remove('render-layout');
				document.getElementById('title-paint').classList.remove('render-paint');
				document.getElementById('svg-browser-layout').classList.remove('render-paint');
			}

			setTimeout(()=>{
				Reveal.addEventListener('slidechanged', clearAnim);
			},100);
		});

	}

	_animateHoudini(){

        Reveal.addEventListener('animate-houdini-workflow', () => {

            document.getElementById('houdini_workflow-1').style.display = '';
            document.getElementById('houdini_workflow-2').style.display = 'none';
            Reveal.addEventListener('fragmentshown', callBackFragment);

            function callBackFragment() {
                document.getElementById('houdini_workflow-1').style.display = 'none';
                document.getElementById('houdini_workflow-2').style.display = '';
                Reveal.removeEventListener('fragmentshown', callBackFragment);
            }
        });
	}
}