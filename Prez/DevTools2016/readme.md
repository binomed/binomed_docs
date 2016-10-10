Add a symbolic link with : 

* /reveal -> {repoHome}/Tools/reveal
* /libs/reveal-md-style-bootstrap -> {repoHome}/Tools/reveal-md-style-bootstrap
* /libs/highlight.js -> {repoHome}/Tools/highlight.js
* /libs/highlight_reveal_fix_v8.0.js -> {repoHome}/Tools/highlight_reveal_fix_v8.0.js


# start chrome : 

Remote debug chromium : 
```bash
sudo chown root:root chrome_sandbox && sudo chmod 4755 chrome_sandbox &&     
export CHROME_DEVEL_SANDBOX="$PWD/chrome_sandbox"
```
