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


    document.getElementById('contactPicker').addEventListener('click', getContacts)
})()