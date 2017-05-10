'use strict'

const MIN_TOP = '95px';
const LINE_HEIGHT = '0.57em';
const ADDITIONNAL_HEIGHT = '0.4em';
const COL_WIDTH = 35;
const LEFT_FIRST = '60px';
const LEFT_TAB = '100px';

function managementGeneric(keyElt, positionArray) {

	const eltHiglight = document.getElementById(`highlight-${keyElt}`);
	let progress = Reveal.getProgress();

	function _progressFragment(event) {
		try {
			let properties = null
			if (event.type === 'fragmentshown') {
				const index = +event.fragment.getAttribute('data-fragment-index');
				properties = positionArray[index + 1];

			} else {
				const index = +event.fragment.getAttribute('data-fragment-index');
				properties = positionArray[index];
				// On reset les properties
				/*if (index > 0) {
					properties = positionArray[index - 1];
				}*/
			}
			if (!properties) {
				return;
			}

			applyProperties(properties);

		} catch (e) {
			console.error(e)
		}
	}

	function applyProperties(properties) {
		try {
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
			eltHiglight.area = area;
			eltHiglight.position = position;
		} catch (e) {}
	}

	function progressFragment(event) {
		// event.fragment // the dom element fragment
		try {
			if (event.type === 'fragmentshown') {
				var index = +event.fragment.getAttribute('data-fragment-index');
				var properties = positionArray[index];
				var keys = Object.keys(properties);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					eltHiglight.style[key] = properties[key];
				}
			} else {
				var index = +event.fragment.getAttribute('data-fragment-index');
				// On reset les properties
				var properties = positionArray[index];
				var keys = Object.keys(properties);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					eltHiglight.style[key] = '';
				}
				if (index > 0) {
					properties = positionArray[index - 1];
					keys = Object.keys(properties);
					for (var i = 0; i < keys.length; i++) {
						var key = keys[i];
						eltHiglight.style[key] = properties[key];
					}
				}
			}
		} catch (e) {}
	}

	function listenFragments() {
		Reveal.addEventListener('fragmentshown', _progressFragment);
		Reveal.addEventListener('fragmenthidden', _progressFragment);
	}

	function unregisterFragments() {
		Reveal.removeEventListener('fragmentshown', _progressFragment);
		Reveal.removeEventListener('fragmenthidden', _progressFragment);
	}

	Reveal.addEventListener(`code-${keyElt}`, function (event) {
		try {
			let currentProgress = Reveal.getProgress();
			applyProperties(currentProgress > progress ? positionArray[0] : positionArray[positionArray.length - 1]);
			listenFragments();
		} catch (e) {
			console.error(e);
		}
	});
	Reveal.addEventListener(`stop-code-${keyElt}`, function (event) {
		try {
			progress = Reveal.getProgress();
			unregisterFragments();
		} catch (e) {
			console.error(e);
		}
	});
}

function init() {

	// Code Connect
	managementGeneric('connect-ble', [{
			line: 1,
			width: '100%'
		},
		{
			line: 2,
			width: '400px'
		}
	]);

	// Code Connect by name
	managementGeneric('connect-by-name', [{
		width: '400px',
		line: 1,
		left: '670px'
	}]);

	// Code Connection
	managementGeneric('connection', [{
		width: '400px',
		line: 3,
		left: LEFT_TAB
	}]);

	// Code Read Characteristic
	managementGeneric('read-charact', [{
			width: '700px',
			line: 1,
			left: LEFT_FIRST
		}, {
			line: 4,
			width: '700px',
			left: LEFT_TAB
		},
		{
			line: 7,
			left: LEFT_TAB,
			width: '500px'
		},
		{
			line: 10,
			nbLines: 2,
			width: '850px',
			left: LEFT_TAB
		}
	]);

	// Code Write Characteristic
	managementGeneric('write-charact', [{
			width: '650px',
			line: 1,
			left: LEFT_FIRST
		},
		{
			line: 2,
			width: '1000px'
		},
		{
			line: 5,
			width: '700px',
			left: LEFT_TAB
		},
		{
			line: 6,
			width: '800px'
		}
	]);

	// Code Write Characteristic
	managementGeneric('vibrate', [{
		width: '350px',
		line: 5,
		left: LEFT_FIRST
	}]);

	// Code Orientation
	managementGeneric('orientation', [{
		width: '850px',
		line: 2,
		left: LEFT_FIRST
	}, {
		line: 8,
		width: '400px',
		nbLines: 3,
		left: LEFT_FIRST
	}]);

	// Code Motion
	managementGeneric('motion', [{
		width: '950px',
		line: 11,
		left: LEFT_TAB
	}, {
		line: 3,
		width: '750px',
		nbLines: 4,
		left: LEFT_TAB
	}]);


	// Code Battery
	managementGeneric('battery', [{
			width: '950px',
			line: 1,
			nbLines: 2
		}, {
			line: 5,
			left: '550px',
			width: '200px'

		},
		{
			line: 10,
			width: '1000px',
			nbLines: 2
		}
	]);


	// Code User Media 1
	managementGeneric('user-media-v1', [{
			width: '500px',
			line: 2,
			left: LEFT_FIRST
		}, {
			line: 13,
			left: LEFT_FIRST,
			width: '1000px'
		},
		{
			line: 8,
			left: '170px',
			width: '210px'
		},
		{
			line: 8,
			left: '380px',
			width: '90px'
		},
		{
			line: 10,
			nbLines: 2,
			left: LEFT_TAB,
			width: '800px'
		}
	]);

	// Code User Media 1
	managementGeneric('user-media-v2', [{
		width: '800px',
		line: 12,
		nbLines: 2,
		left: LEFT_FIRST
	}, {
		line: 10,
		left: LEFT_TAB,
		width: '600px'
	}]);

	// Code Device Proximity
	managementGeneric('device-proximity', [{
		width: '1000px',
		line: 6,
		left: LEFT_TAB
	}, {
		line: 2,
		left: '250px',
		width: '170px'
	}]);

	// Code User Proximity
	managementGeneric('user-proximity', [{
		width: '1000px',
		line: 8,
		left: LEFT_TAB
	}, {
		line: 2,
		left: '150px',
		width: '150px'
	}]);

	// Code Web Speech
	managementGeneric('web-speech', [{
			width: '650px',
			line: 1
		}, {
			line: 2,
			width: '450px'
		},
		{
			line: 3,
			width: '500px'
		},
		{
			line: 4,
			width: '550px'
		},
		{
			line: 6,
			width: '350px'
		},
		{
			line: 7,
			width: '350px'
		},
		{
			line: 8,
			left: '280px',
			width: '450px'
		}
	]);

	// Code Web Speech Grammar
	managementGeneric('web-speech-grammar', [{
			width: '1200px',
			line: 1
		}, {
			line: 3,
			width: '800px'
		},
		{
			line: 4,
			width: '750px'
		},
		{
			line: 5,
			width: '700px'
		}
	]);

	// Code Web Speech Synthesis
	managementGeneric('web-speech-synthesis', [{
			width: '550px',
			line: 1
		}, {
			line: 3,
			width: '900px'
		},
		{
			line: 4,
			width: '450px'
		},
		{
			line: 5,
			width: '500px'
		},
		{
			line: 6,
			width: '450px'
		},
		{
			line: 7,
			width: '400px'
		}
	]);

	// Code Notifications
	managementGeneric('notification', [{
			width: '800px',
			line: 2,
			left: LEFT_TAB
		}, {
			line: 3,
			width: '350px',
			left: '120px'
		},
		{
			line: 4,
			width: '800px',
			left: '140px'
		},
		{
			line: 5,
			width: '800px',
			nbLines: 5,
			left: '170px'
		}
	]);

	// Code Visibility
	managementGeneric('visibility', [{
		line: 11,
		width: '1000px',
		left: LEFT_TAB
	}, {
		line: 2,
		width: '550px',
		left: LEFT_TAB
	}]);
	/*
	 */


}

module.exports = {
	init: init
};