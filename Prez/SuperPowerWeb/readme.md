Add a symbolic link with : 

* /reveal -> {repoHome}/Tools/reveal
* /libs/reveal-md-style-bootstrap -> {repoHome}/Tools/reveal-md-style-bootstrap
* /libs/highlight.js -> {repoHome}/Tools/highlight.js
* /libs/highlight_reveal_fix_v8.0.js -> {repoHome}/Tools/highlight_reveal_fix_v8.0.js


For the server part, to run it follow the installation needed for https://github.com/sandeepmistry/bleno. Use Chrome Dev for physical Web


DONT FORGET for LINUX TO Stop BLUETOOTH (Bleno )

DONT FORGET TO BE ROOT ! 

Connexion à la RPI : 
$ ssh pi@raspberrypi
password : raspberry

NE PAS OUBLIER DE FERMER LES ONGLETS CHROMMIUM !!! NE PAS OUBLIER DE LANCER LE SCRIPT LINUX !!!


Remote debug firefox : 
->./adb forward tcp:6000 localfilesystem:/data/data/org.mozilla.fennec/firefox-debugger-socket
-> ./adb forward tcp:6000 localfilesystem:/data/data/org.mozilla.firefox_beta/firefox-debugger-socket


Remote debug chromium : 
sudo chown root:root chrome_sandbox && sudo chmod 4755 chrome_sandbox &&     export CHROME_DEVEL_SANDBOX="$PWD/chrome_sandbox"

Urls de jeux : 
* binomed url => http://goo.gl/iQiTvZ
* Raw git => https://goo.gl/Kp7Cyi


Rpi Zero pins for demo : 

  usb     usb                 hdmi
 power    hub                    ,-> red cable
 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 x 0 0 0
 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 x 0 0
                                   `-> black cable


Save life commands for bluetooth : 

```sh
# Stop service bluetooth
$ sudo service bluetooth stop
# Start service bluetooth (hciconfig must be down)
$ sudo service bluetooth start
# Start adapter bluetooth (mandatory for advertising !)
$ sudo hciconfig hci0 up
# Stop adapter bluetooth
$ sudo hciconfig hci0 down
```



ORDER : 

1. Allumer Nexus 4 et le brancher au pc
   1.  Lancer l'application physicalWeb
   2. Vérifier qu'il n'y a aucun onglet chromium d'ouvert !
2. Se connecter à binomed.fr
3. Démarer le serveur en sudo
3. Allumer téléphone Routeur
   1. Allumer la rpi
   2. Se connecter en ssh à la rpi
   3. Lancer le script linux
   4. Démarer l'application avec sudo
4. Lancer chromium pour le debug
5. Lancer Chrome pour la prez ! 
6. Démarer le serveur en local avec l'option -l
7. Aller sur localhost:8000 -> S pour avoir les notes speakers ! 
8. Vérifier le son
