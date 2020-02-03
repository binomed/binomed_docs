export class Demos{
    constructor(){
        this.socketInit();
        this._fileDemo();
    }

    socketInit(){
        try{
            const socket = io('http://localhost:9999');
    
            socket.emit('chat message', {test:'test'});
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

}