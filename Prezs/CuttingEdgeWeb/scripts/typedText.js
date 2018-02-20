'use strict';

export class TypeText {

	constructor(){
		Reveal.addEventListener('css-var-type', ()=>{
			typing('title-css-var', 10, 0)
			.type('CSS Variables').wait(2000).speed(50)
			.delete('Variables').wait(500).speed(100)
			.type('Custom Properties');
		});
	}
}