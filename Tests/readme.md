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


Remote debug firefox : 
->./adb forward tcp:6000 localfilesystem:/data/data/org.mozilla.fennec/firefox-debugger-socket
-> ./adb forward tcp:6000 localfilesystem:/data/data/org.mozilla.firefox_beta/firefox-debugger-socket


Remote debug chromium : 
sudo chown root:root chrome_sandbox && sudo chmod 4755 chrome_sandbox &&     export CHROME_DEVEL_SANDBOX="$PWD/chrome_sandbox"