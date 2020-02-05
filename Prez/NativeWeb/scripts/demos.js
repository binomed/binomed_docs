export class Demos{
    constructor(){
        this.socket = this.socketInit();
        this._fileDemo();
        this._contactDemo();
        this._nfcDemo();
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

}