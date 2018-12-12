'use strict'


class MediaCaptureDemo {
    constructor({
        video
    }) {
        this._stream = null;
        this.video = video;
        this.track = null;
        this.imageCapture = null;

    }

    set stream(stream) {
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
        this._detectingLabels('', this._callVisionApi);
    }

    /***
     * Generic method to get video and drag and drop management
     * @param prefix: the prefix to target elements in the html
     * @param analyzeMethod: the method called to analyze the blob
     */
    _detectingLabels(prefix, analyzeMethod) {

        // Video 
        const video = document.getElementById(`${prefix}mirror-label`);
        const mediaCaptureDemo = new MediaCaptureDemo({
            video
        });
        // Drag & drop
        const targetDrop = document.getElementById(`${prefix}targetVision`);
        // Result element
        const labelDetected = document.getElementById(`${prefix}labels-detected`);

        // Start the camera
        document.getElementById(`${prefix}startVideo`).addEventListener('click', () => {
            targetDrop.classList.add('hide');
            video.classList.remove('hide');

            navigator.mediaDevices.getUserMedia({
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
                });
        });
        
        // Take a picture using media capture api
        document.getElementById(`${prefix}takeAPicture`).addEventListener('click', () => {
            mediaCaptureDemo.imageCapture.takePhoto()
                .then(blob => {
                    analyzeMethod(video, labelDetected, blob);
                })
        });


        // Drag & Drop management
        targetDrop.addEventListener('drop', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            targetDrop.innerHTML = `<img src='${URL.createObjectURL(file)}' >`
            analyzeMethod(targetDrop, labelDetected, file);
        });
        targetDrop.addEventListener('dragover', (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        })
    }


    /**
     * Call Google Vision Api
     * @param {HTMLElement} elementToReduce 
     * @param {HTMLElement} targetElement 
     * @param {Blob} blob 
     */
    _callVisionApi(elementToReduce, targetElement, blob) {
        const formData = new FormData();
        formData.append('blob', blob);
        fetch('http://localhost:8000/vision', {
                method: 'POST',
                mode: 'cors',
                body: formData
            }).then((tojson) => tojson.json())
            .then((results) => {
                elementToReduce.classList.add('with-label');
                targetElement.classList.remove('hide');
                let resultStr = '';
                results.forEach((annotationResult, index) => {
                    resultStr += `Result : ${index} \n<ul>`;
                    annotationResult.labelAnnotations.forEach(annotation => {
                        resultStr += `<li>${annotation.description} : ${annotation.score}</li>`;
                    });
                    resultStr += '</ul>'
                });
                targetElement.innerHTML = resultStr;
            });
    }
}