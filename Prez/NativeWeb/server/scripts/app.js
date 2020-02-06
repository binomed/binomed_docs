const serverUrl = `${location.protocol}//${location.hostname}${location.port ? ':'+location.port : ''}`;
const socket = io(serverUrl);
    
function blobToBase64(blob){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
            resolve(reader.result);                
        }
    });
}

//socket.emit('chat message', {test:'test'});
(async ()=>{


    /***
     * Contact Api
     * 
     */

    async function getContacts() {
        const props = ['name', 'email', 'tel', 'address', 'icon'];
        const opts = {multiple: false};

        try {
            const supported = ('contacts' in navigator && 'ContactsManager' in window);
            const contacts = await navigator.contacts.select(props, opts);
            console.log(contacts);
            fetch(`${serverUrl}/contacts`, {
                method:'POST',
                body: {test: 'test'}
            })
            if (contacts && contacts.length > 0){
                const selectedContact = contacts[0];
                blobToBase64(selectedContact.icon[0])
                .then(base64Img => {
                    socket.emit('contacts', {...selectedContact, icon: base64Img});
                })
            }

            //socket.send('contacts', {test:"test"});
            
        } catch (ex) {
            console.error(ex);
        // Handle any errors here.
        }
    }

    /**
     * 
     * NFC API
     */

    async function readTag(){
        const reader = new NDEFReader();
        const controller = new AbortController();
        await reader.scan({signal: controller.signal});
        reader.onreading = event => {
        const message = event.message;

        if (message.records.length == 0 ||     // unformatted tag
            message.records[0].recordType == 'empty' ) {  // empty record
            const writer = new NDEFWriter();
            writer.write({
            records: [{ recordType: "text", data: 'Hello World' }]
            });
            controller.abort();
            return;
        }
        const newMessage = {records : []};
        const decoder = new TextDecoder();
        for (const record of message.records) {
            switch (record.recordType) {
            case "text":
                const textDecoder = new TextDecoder(record.encoding);
                newMessage.records.push({
                    recordType : record.recordType,
                    data: textDecoder.decode(record.data),
                    lang : record.lang
                });
                break;
                case "url":
                    newMessage.records.push({
                        recordType : record.recordType,
                        data: decoder.decode(record.data)
                    });
                break;
            case "mime":
                /*if (record.mediaType === "application/json") {
                console.log(`JSON: ${JSON.parse(decoder.decode(record.data))}`);
                }
                else if (record.mediaType.startsWith('image/')) {
                const blob = new Blob([record.data], { type: record.mediaType });

                const img = document.createElement("img");
                img.src = URL.createObjectURL(blob);
                img.onload = () => window.URL.revokeObjectURL(this.src);

                document.body.appendChild(img);
                }
                else {
                console.log(`Media not handled`);
                }
                break;
               */
            default:
            }
        }

        socket.emit('nfc', newMessage);
        controller.abort();
        
        };
    }

    async function writeTag(type){
        const writer = new NDEFWriter();
        const recordUrl = { recordType: "url", data: "https://sfeir.com" };
        const recordText = { recordType: "text", data: 'Hello Fugu lovers' }
        writer.write({
            records: [type === 'url' ? recordUrl : recordText]
        }).then(() => {
            console.log("Message written.");
        }).catch(_ => {
            console.log("Write failed :-( try again.");
        });
    }

    async function ambiantLight(){
        if ('AmbientLightSensor' in window) {
            const sensor = new AmbientLightSensor({frequency: 9});
            sensor.addEventListener('acticate', ()=> console.log('Activate and measuring'))
            sensor.onreading = () => {
                socket.emit('light', {illuminance : sensor.illuminance});
            }
            sensor.start();
        }
    }


    /**
     * Call all Apis
     */

    // Contact Api
    document.getElementById('contactPicker').addEventListener('click', getContacts)
    // NFC api
    document.getElementById('readTag').addEventListener('click', readTag)
    document.getElementById('writeTagUrl').addEventListener('click', () => writeTag('url'))
    document.getElementById('writeTagText').addEventListener('click', () => writeTag('text'))
    // Ambiant Light
    document.getElementById('readLight').addEventListener('click', ambiantLight)

})()