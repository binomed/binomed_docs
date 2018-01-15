# Avant le talk
* **serveur node mode classique**
* **Répertoire ouvert**
* **Visual studio ouvert sur le code !**
* **Zoom du terminal**
* **Désactiver flag devtools : chrome://flags/#enable-devtools-experiments**
* **Zoom 200% devtools**
* **Ouvrir Chrome unstable**

# Démarage des projets

## Prez :

* `gulp`
* Ouvrir chrome sur http://localhost:3000

## PWA :

* `cd pwa & gulp`
* `node server.js` à ne pas lancer tout de suite ! à lancer depuis le terminal
* Ouvrir chrome sur http://localhost:3002

## Chrome Terminal

* Grab the DevTools repo: `$ git clone --depth 1 https://github.com/ChromeDevTools/devtools-frontend.git && cd devtools-frontend/services && npm i`
* Start the terminal script: `$ node devtools.js`
* Start Canary: `$ google-chrome-unstable --remote-debugging-port=9222 --devtools-flags='service-backend=ws://localhost:9022/endpoint'`
* Go to Settings > Experiments
* Hit Shift 6 times
* Enable the Terminal in Drawer experiment
* Restart DevTools
* Access the DevTools terminal via the drawer

# Début du talk

## Debug nodeJS

* `node --inspect-brk server.js`

## Snippets

```javascript
var init = () => {
    const personList = [{
        firstName: 'John',
        lastName: 'Doe',
        age: 25
    }, {
        firstName: 'Jane',
        lastName: 'Doe',
        age: 25
    }, {
        firstName: 'Jean-François',
        lastName: 'Garreau',
        age: 34
    }, {
        firstName: 'Julien',
        lastName: 'Landure',
        age: 34
    }];

    const namesOlders = personList
        .filter((person) => person.age > 30)
        .map((person) => {
            return {
                name: `${person.firstName} ${person.lastName}`
            };
        });

    console.table(namesOlders);


    const superLog = (chaine) => {
        console.info(Date.now, chaine);
    }
}

init();
```