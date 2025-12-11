const shelljs = require('shelljs');

shelljs.rm('-rf', './web_modules');
shelljs.mkdir('-p', './web_modules/talk-control-revealjs-extensions');
shelljs.cp('-rf', './node_modules/@talk-control/talk-control-revealjs-extensions/dist/*', './web_modules/talk-control-revealjs-extensions');
