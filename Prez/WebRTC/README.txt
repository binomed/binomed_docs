Reveal presentation for webRTC

Add a symbolic link with : 

* /reveal -> {repoHome}/Tools/reveal
* /libs/sockets-notes -> {repoHome}/Tools/sockets-notes
* /libs/reveal-md-style-bootstrap -> {repoHome}/Tools/reveal-md-style-bootstrap
* /libs/highlight.js -> {repoHome}/Tools/highlight.js
* get all mandatory dependancies for server : cd server -> npm install
* start server for webRTC : node /server/server.js

# For running the app ! 

1. open a terminal
2. goto binomed_docs/Prez/WebRTC/server
3. start server : node server.js
4. open a new terminal
5. goto binomed_docs/Prez/WebRTC
6. Start SpeakerWS : node libs/sockets-notes/server/src/server.js -d true
7. open Navigator and goto localhost:8080
8. scan the QRCode for preloading the app
9. Close BarcodeScanner !
10. Close tab with SpeakerWS
11. open a new tab on chrome phone and goto : http://yourIpAdress:8080/index_phone.html (if it doesn't work for first time, alternate reload of presentation and phone)
12. Close the app (server & tab)
13. scan the QRCode
