export class Demos{
    constructor(){
        this.socket = this.socketInit();
        try{
            this._fileDemo();
        }catch(e){
            console.warn(e);
        }
        try{
            this._contactDemo();
        }catch(e){
            console.warn(e);
        }
        try{
            this._nfcDemo();
        }catch(e){
            console.warn(e);
        }
        try{
            this._demoSerial();
        }catch(e){
            console.warn(e);
        }
        try{
            this._demoLight();
        }catch(e){
            console.warn(e);
        }
        try{
            this._demoMustache();
        }catch(e){
            console.warn(e);
        }
    }

    socketInit(){
        try{
            return io('http://localhost:9999');
    
        }catch(e){
            console.warn(e);
        }
    }

    async _fileDemo(){
        try{
            let fileHandle;
            const butOpenFile = document.getElementById('file-chooser');
            const editArea = document.getElementById('edit-file');
            butOpenFile.addEventListener('click', async (e) => {
                fileHandle = await window.chooseFileSystemEntries();
                //fileHandle = await getNewFileHandle();
                const file = await fileHandle.getFile();
                const contents = await file.text();
                editArea.value = contents;
            });

            const saveFile = document.getElementById('file-save');
            saveFile.addEventListener('click', async (e) => {
                await writeFile(fileHandle, editArea.value);
            })

            async function getNewFileHandle() {
                const opts = {
                  type: 'saveFile',
                  accepts: [{
                    description: 'Text file',
                    extensions: ['md','txt'],
                    mimeTypes: ['text/plain'],
                  }],
                };
                return await window.chooseFileSystemEntries(opts);
              }

            async function writeFile(fileHandle, contents) {
                // Create a writer (request permission if necessary).
                const writer = await fileHandle.createWriter();
                // Write the full length of the contents
                await writer.write(0, contents);
                // Close the file and write the contents to disk
                await writer.close();
              }

        }catch(e){
            console.warn(e);
        }
    }

    async _contactDemo(){
        const contactIcon = document.getElementById('contact-icon');
        const contactName = document.getElementById('contact-name');
        const contactTel = document.getElementById('contact-tel');
        const contactEmail = document.getElementById('contact-email');
        const contactAddress = document.getElementById('contact-address');
        this.socket.on('contacts', (contact)=>{
            if (contact.icon){
                contactIcon.src = contact.icon;
            }
            if(contact.name){
                contactName.innerHTML = contact.name;
            }
            if(contact.tel && contact.tel.length > 0){
                contactTel.innerHTML = contact.tel[0].substr(0,3)+'** ** ** **';
            }
            if (contact.email && contact.email.length > 0){
                contactEmail.innerHTML = contact.email[0].substr(0, 4)+'****@gmail.com';
            }
            if (contact.address && contact.address.length > 0){
                contactAddress.innerHTML = contact.address[0].city;
            }
            console.log(contacts);
        });
    }

    async _nfcDemo(){
        const nfcType = document.getElementById('nfc-type');
        const nfcData = document.getElementById('nfc-data');
        this.socket.on('nfc', (message) => {
            for (const record of message.records) {
                nfcType.innerHTML = record.recordType;
                switch (record.recordType) {
                case "text":
                    nfcData.innerHTML = `${record.data} (${record.lang})`;
                    break;
                case "url":
                    nfcData.innerHTML = `${record.data}`;
                    break;
                default:
                    nfcData.innerHTML = 'Not implemented'
                }
            }
        })
    }

    async _demoSerial(){
        const connectButton = document.getElementById ('connect-button');
        let port;
        let lineBuffer = '';
        let stopSerial = true;
        let latestValue = 0;

        if ('serial' in navigator) {
            connectButton.addEventListener('click',  async () => {
                stopSerial = false;
                renderDemo()
                port = await navigator.serial.requestPort({});
                await port.open({ baudrate: 9600 });
        
                const appendStream = new WritableStream({
                  write(chunk) {
                    lineBuffer += chunk;
        
                    let lines = lineBuffer.split('\n');
        
                    if (lines.length > 1) {
                      lineBuffer = lines.pop();
                      latestValue = parseInt(lines.pop().trim());
                    }
                  }
                });
        
                port.readable
                  .pipeThrough(new TextDecoderStream())
                  .pipeTo(appendStream,{preventClose:true, preventCancel:true});

                function unsubscribeSerial(){
                    port.close();
                    port = undefined;
                    stopSerial = true;
                    Reveal.removeEventListener('slidechanged', unsubscribeSerial);
                }

                Reveal.addEventListener('slidechanged', unsubscribeSerial)
            });

            connectButton.disabled = false;
        }

        function renderDemo() {
            const rabbit = document.querySelector('.panda');
            const percentage = Math.floor(latestValue / 1023 * 100);
            //const percentageStatus = document.querySelector('figcaption span');
    
            rabbit.style.left = 'calc(' + percentage + '% - 2em)';
            //percentageStatus.innerText = percentage;
    
            if (!stopSerial){
                window.requestAnimationFrame(renderDemo);
            }
        }

    }

    async _demoLight(){
        const boo = document.getElementById('boo');
        this.socket.on('light', (message) => {
            if (message.illuminance === 0){
                boo.classList.remove('hide')
            }else{
                boo.classList.add('hide')
            }
        });
    }

    async _demoMustache(){

        if (!('FaceDetector' in window)) {
            FaceDetector = function() {
              console.log('Fake Face Detector used...');
              return {
                detect: async function() { return [] }
              }
            }
          }
        const faceDetector = new FaceDetector({ fastMode: true, maxDetectedFaces: 1 }); // Fast Detection
        let faces = []; // First initialisation to be sure to not have a NPE

        let isDetectingFaces = false;

        // this.easterEgg = false; Not use
        let context = undefined;
        let ratio = 0;
        let stopDraw = false;

        Reveal.addEventListener('start-mustache', async ()=>{

            async function getUserMedia() {
                // Grab camera stream.
                const constraints = {
                    video: {
                    facingMode: 'user', // To be sure to use the front camera for smartphones !
                    frameRate: 60, // To be sure to have a high rate of images
                    }
                };
        
                video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);
                // We starts the video
                await video.play();
        
                // The canvas take the size of the screen
                const demoDiv = document.getElementById('demo-mustache');
                canvas.height = demoDiv.getBoundingClientRect().height;
                canvas.width = demoDiv.getBoundingClientRect().width;
                // HACK: Face Detector doesn't accept canvas whose width is odd.
                if (canvas.width % 2 == 1) {
                    canvas.width += 1;
                }
        
                context = canvas.getContext('2d');
                // Ratio use to determine the rendering of video in canvas
                // We take the max ratio and apply it to canvas after
                // Width could be diferent from camera and screen !
                ratio = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
        
                console.log('Ratio Width', canvas.width, video.videoWidth, canvas.width / video.videoWidth);
                console.log('Ratio Height', canvas.height, video.videoHeight, canvas.height / video.videoHeight);
        
                console.log('X Dest', canvas.width - video.videoWidth * ratio);
                draw();
            }
        
            async function draw() {
                if (stopDraw){
                    return;
                }
                // To be sure to have the minimum delay between frames
                requestAnimationFrame(draw);
        
                // Draw video frame.
                context.drawImage(video, // Source
                    (canvas.width - video.videoWidth * ratio) / 2, // x dest in canvas
                    // => use to manage portrait vs landscape
                    0, // y dest in canvas
                    video.videoWidth * ratio, // width video in canvas
                    video.videoHeight * ratio); // height video in canvas
        
                if (!isDetectingFaces) {
                    // Detect faces.
                    isDetectingFaces = true;
                    faceDetector.detect(canvas).then((facesArray => {
                        faces = facesArray;
                        isDetectingFaces = false;
                    }));
                }
                // Draw mustache and hat on previously detected face.
                if (faces.length) {
                    const face = faces[0].boundingBox;
                    // we get a clientBoudingRect of face placed in the image !
                    /*
                        height and width give the height and width in px of the face (in the image)
                        left, top, bottom, right give the absolute position of the face (in the image)
                    */
                    context.drawImage(hat, // Source Hat
                        face.left, // x dest Hat
                        // we start from the left position
                        face.bottom - face.height * 3 / 4 - hat.height * face.width / hat.width, // Y dest Hat
                        // 3/4 of the face height - height of hat apply to ratio of the face width !
                        face.width, // width of hat in canvas
                        // We take the face width
                        hat.height * face.width / hat.width // height of hat apply to ratio of the face width
                    );
                    context.drawImage(mustache, // Source Mustache
                        face.left + face.width / 4, // X dest mustache
                        // 1 / 4
                        face.top + face.height * 3 / 5, // Y dest mustache
                        // 3/4 of the face
                        face.width / 2,  // width of mustache in canvas
                        // The mustache will take the half of the face width
                        mustache.height * face.width / 2 / mustache.width // height of mustache in canvas
                        // The mustache will take the ratio of half the widht of face divide by mustache width to respect proportions
                    );
                }
            }

            function unsubscribeMustache(){
                const stream = video.srcObject;
                let tracks = stream.getTracks();
                tracks.forEach(function(track) {
                  track.stop();
                });
                video.pause();
                stopDraw = true;
                Reveal.removeEventListener('slidechanged', unsubscribeMustache);
            }
    
            Reveal.addEventListener('slidechanged', unsubscribeMustache);

             // Get elements from Id
             const canvas = document.getElementById('canvas');
             const video = document.getElementById('video');
             const mustache = document.getElementById('mustache');
             const hat = document.getElementById('hat');
 
             //Affect url to images
             hat.src = './assets/images/hat.png';
             mustache.src = './assets/images/mustache.png';
 
             // Inner method User Media (different from real user media method !)
             await getUserMedia();
        })
    }

}