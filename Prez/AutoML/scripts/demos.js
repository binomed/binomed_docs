'use strict'

export class Demos {
    constructor() {
        this._detectingLabels();
    }

    _detectingLabels() {

        const video = document.getElementById('mirror-label');
        document.getElementById('startVideo').addEventListener('click', () => {
            navigator.getMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);

            navigator.getMedia({
                    video: true,
                    audio: false
                },
                (stream) => {
                    if (navigator.mozGetUserMedia) {
                        video.mozSrcObject = stream;
                    } else {
                        let vendorURL = window.URL || window.webkitURL;
                        video.src = vendorURL.createObjectURL(stream);
                    }
                    video.play();
                },
                (err) => {
                    console.log("An error occured! " + err);
                }
            );


        });

        document.getElementById('takeAPicture').addEventListener('click', () => {
            alert('toto');
        });

    }
}