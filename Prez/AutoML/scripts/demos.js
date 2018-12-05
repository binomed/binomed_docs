'use strict'


class MediaCaptureDemo {
    constructor({video}){
        this._stream = null;
        this.video = video;
        this.track = null;
        this.imageCapture = null;

    }

    set stream(stream){
        this._stream = stream;
        this.track = stream.getVideoTracks()[0];
        this.imageCapture = new ImageCapture(this.track);
    }

    get stream() {
        return this._stream;
    }
}

export class Demos {
    constructor() {
        this._detectingLabels();
    }

    _detectingLabels() {

        const video = document.getElementById('mirror-label');
        const mediaCaptureDemo = new MediaCaptureDemo({video});
        document.getElementById('startVideo').addEventListener('click', () => {
            navigator.getMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);

            navigator.mediaDevices.getMedia({
                video: true,
                audio: false
            })
            .then((stream) => {
                mediaCaptureDemo.stream = stream;
                if (navigator.mozGetUserMedia) {
                    mediaCaptureDemo.video.mozSrcObject = stream;
                } else {
                    let vendorURL = window.URL || window.webkitURL;
                    mediaCaptureDemo.video.src = vendorURL.createObjectURL(stream);
                }
                mediaCaptureDemo.video.play();
            })
            .catch((err) => {
                    console.log("An error occured! " + err);
                }
            );


        });

        document.getElementById('takeAPicture').addEventListener('click', () => {
            mediaCaptureDemo.imageCapture.takePhoto()
            .then(blob=> {
                alert('photo take');
            })
        });

    }
}