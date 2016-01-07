
cd ..\..
set WORKING_DIRECTORY=%cd%
echo "Set Link to Theme"
MKLINK /D %WORKING_DIRECTORY%\Prez\SuperPowerWeb\css\theme %WORKING_DIRECTORY%\Themes\css\theme
echo "Set Link to reveal"
MKLINK /D %WORKING_DIRECTORY%\Prez\SuperPowerWeb\reveal %WORKING_DIRECTORY%\Tools\reveal
echo "Set Link to sockets-notes"
MKLINK /D %WORKING_DIRECTORY%\Prez\SuperPowerWeb\libs\sockets-notes %WORKING_DIRECTORY%\Tools\sockets-notes
echo "Set Link to reveal theme bootstrap"
MKLINK /D %WORKING_DIRECTORY%\Prez\SuperPowerWeb\libs\reveal-md-style-bootstrap %WORKING_DIRECTORY%\Tools\reveal-md-style-bootstrap
echo "Set Link to HighlightJS"
MKLINK /D %WORKING_DIRECTORY%\Prez\SuperPowerWeb\libs\highlight.js %WORKING_DIRECTORY%\Tools\highlight.js
echo "Set Link to HighlightJS Fix for reveal"
MKLINK /H %WORKING_DIRECTORY%\Prez\SuperPowerWeb\libs\highlight_reveal_fix_v8.0.js %WORKING_DIRECTORY%\Tools\highlight_reveal_fix_v8.0.js
cd Prez\SuperPowerWeb