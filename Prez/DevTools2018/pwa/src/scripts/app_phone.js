'use strict'
import {
    COLORS
} from './common/colors.js';
import {
    BASE_COLOR
} from './common/const.js';
import {
    DrawCanvas
} from './canvas/drawCanvas.js';


(function () {

    let gameInit = false, // true if we init the legoGrid
        fireBaseApp = null, // the reference of the fireBaseApp
        drawCanvas = null, // The legoGrid
        keys = null, // The keys of firenase submit draw
        snapshotFb = null, // The snapshot of submit draw
        index = 0;


    function initGame() {

        drawCanvas = new DrawCanvas('canvasDraw', true);

        $("#color-picker2").spectrum({
            showPaletteOnly: true,
            showPalette: true,
            color: BASE_COLOR,
            palette: COLORS,
            change: function (color) {
                drawCanvas.changeColor(color.toHexString());
            }
        });
    }

    function pageLoad() {


        /**
         * Management of Cinematic Buttons
         */
        const startBtn = document.getElementById('startBtn');

        const streamStart = Rx.Observable
            .fromEvent(startBtn, 'click')
            .map(() => 'start');


        streamStart.subscribe((state) => {
            if (state === 'start') {
                document.getElementById('hello-msg').setAttribute("hidden", "");
                document.getElementById('game').removeAttribute('hidden');
                document.getElementById('color-picker2').removeAttribute('hidden');
                if (!gameInit) {
                    document.getElementById('loading').removeAttribute('hidden');
                    // Timeout needed to start the rendering of loading animation (else will not be show)
                    setTimeout(function () {
                        gameInit = true;
                        initGame();
                        document.getElementById('loading').setAttribute('hidden', '')
                    }, 50);
                }
            }
        })


        /**
         * Management of submission
         */
        document.getElementById('btnSubmission').addEventListener('click', () => {

            document.getElementById('uploading').style.display = '';
            // We first upload the image :
            const currentDraw = {
                user: 'User Name',
                userId: 'userId'
            };
            const drawId = `${currentDraw.userId}-${Date.now()}`;
            // We prepare the storage in database
            const base64DataUrl = drawCanvas.snapshot();
            currentDraw.dataUrl = base64DataUrl;

            // Upload Image
            const URL = `http://localhost:9000/draw/${currentDraw.userId}`;
            fetch(URL, {
                    method: 'post',
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=utf-8'
                    }),
                    body: JSON.stringify(currentDraw)
                })
                .then(function (response) {
                    console.info(response);
                    drawCanvas.resetBoard();
                    document.querySelector('#snackbar-container').MaterialSnackbar.showSnackbar({
                        message: 'Drawing submited! Thanks!'
                    });
                    document.getElementById('uploading').style.display = 'none';
                });
        });

        /**
         * Management of menu items
         */

        const menuGame = document.getElementById('menu-game');
        const menuCreations = document.getElementById('menu-creations');
        const menuSlider = document.getElementById('slider-width');
        const menuBrush = document.getElementById('menuBrush');
        const menuClear = document.getElementById('menuClear');


        const streamGame = Rx.Observable
            .fromEvent(menuGame, 'click')
            .map(() => 'game');

        const streamCreations = Rx.Observable
            .fromEvent(menuCreations, 'click')
            .map(() => 'creations');

        const streamBrush = Rx.Observable
            .fromEvent(menuBrush, 'click')
            .map(() => 'brush');

        const streamClear = Rx.Observable
            .fromEvent(menuClear, 'click')
            .map(() => 'clear');

        streamGame.merge(streamCreations)
            .merge(streamBrush)
            .merge(streamClear)
            .subscribe((state) => {
                if (state === 'game') {
                    manageStateDivs(state);

                } else if (state === 'creations') {
                    manageStateDivs(state);


                    const user = {
                        name: 'User Name',
                        id: 'userId'
                    };
                    const myInit = {
                        method: 'GET'
                    };
                    const URL = `http://localhost:9000/draw/${user.id}`;
                    fetch(URL, myInit)
                        .then(function (snapshot) {
                            return snapshot.json();
                        })
                        .then(function (snapshot) {
                            if (snapshot) {
                                console.log(snapshot);
                                snapshotFb = snapshot;
                                keys = Object.keys(snapshotFb);
                                index = 0;
                                draw();
                            } else {
                                console.log('no draw !');
                                document.querySelector('#snackbar-container').MaterialSnackbar.showSnackbar({
                                    message: 'You haven\'t yet submit drawings.'
                                });
                                document.getElementById('btnLeft').disabled = true;
                                document.getElementById('btnRight').disabled = true;
                            }
                        });

                } else if (state === 'brush') {
                    if (drawCanvas.getEraserMode()) {
                        document.querySelector('#menuBrush i').innerHTML = 'brush';
                    } else {
                        document.querySelector('#menuBrush i').innerHTML = 'healing';

                    }
                    drawCanvas.toggleEraser();

                } else if (state === 'clear') {
                    drawCanvas.resetBoard();
                }
            });

        menuSlider.addEventListener('change', (event) => {
            drawCanvas.changeWidth(menuSlider.value);
        });


        /**
         * Management of Buttons for changing of draw
         */

        const btnLeft = document.getElementById('btnLeft');
        const btnRight = document.getElementById('btnRight');

        const streamBtnLeft = Rx.Observable
            .fromEvent(btnLeft, 'click', () => index = Math.max(index - 1, 0));
        const streamBtnRight = Rx.Observable
            .fromEvent(btnRight, 'click', () => index = Math.min(index + 1, keys.length - 1));

        streamBtnLeft.merge(streamBtnRight).subscribe(draw);

    }

    function manageStateDivs(state) {
        switch (state) {
            case 'game':
                document.querySelector('.page-content').removeAttribute('hidden');
                document.getElementById('submitted').setAttribute('hidden', '');
                document.getElementById('menu-game').setAttribute('hidden', '');
                document.getElementById('menu-creations').removeAttribute('hidden');
                document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
                document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
                break;
            case 'creations':
                document.querySelector('.page-content').setAttribute('hidden', '');
                document.getElementById('submitted').removeAttribute('hidden');
                document.getElementById('menu-game').removeAttribute('hidden');
                document.getElementById('menu-creations').setAttribute('hidden', '');
                document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
                document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
                break;

        }
    }

    /**
     * Show a draw and show it's state : Rejected or Accepted
     */
    function draw() {
        let draw = snapshotFb[keys[index]];
        let imgSubmission = document.getElementById('imgSubmission');
        let parentImg = imgSubmission.parentElement;

        const btnLeft = document.getElementById('btnLeft');
        const btnRight = document.getElementById('btnRight');

        if (index === 0) {
            btnLeft.disabled = true;
        } else {
            btnLeft.removeAttribute('disabled');
        }

        if (index === keys.length - 1) {
            btnRight.disabled = true;
        } else {
            btnRight.removeAttribute('disabled');
        }

        imgSubmission.src = draw.dataUrl;
        if (draw.accepted && !parentImg.classList.contains('accepted')) {
            parentImg.classList.remove('rejected');
            parentImg.classList.add('accepted');
        } else if (!draw.accepted) {
            parentImg.classList.remove('accepted');
            parentImg.classList.add('rejected');
        }

    }


    window.addEventListener('load', pageLoad);

    /* SERVICE_WORKER_REPLACE */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker-phone.js', {
                scope: location.pathname
            })
            .then((serviceWorkerRegistration) => {
                console.log('Service Worker Register for scope : %s', serviceWorkerRegistration.scope);
                if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
                    return;
                }
                if (Notification.permission == 'denied') {
                    return;
                }
                if (!('PushManager' in window)) {
                    return;
                }
                return serviceWorkerRegistration.pushManager.getSubscription()
                    .then((subscription) => {
                        if (subscription) {
                            console.log('Registration to notification already done !');
                            return subscription;
                        } else {
                            return serviceWorkerRegistration.pushManager.subscribe({
                                    userVisibleOnly: true
                                })
                                .then((realSubscription) => {
                                    console.log('Registration done !');
                                    return;
                                });
                        }
                    })
            });
    }
    /* SERVICE_WORKER_REPLACE */

})();