#!/bin/bash
sudo mkdir libs
cd ../..
WORKING_DIRECTORY="$PWD"
echo "Set Link to Theme"
sudo ln -s $WORKING_DIRECTORY/Themes/css/theme $WORKING_DIRECTORY/Prez/RTTSiteswap/css/theme
echo "Set Link to Theme scss"
sudo ln -s $WORKING_DIRECTORY/Themes/scss/theme $WORKING_DIRECTORY/Prez/RTTSiteswap/scss/theme
echo "Set Link to reveal"
sudo ln -s $WORKING_DIRECTORY/Tools/reveal $WORKING_DIRECTORY/Prez/RTTSiteswap/reveal
echo "Set Link to sockets-notes"
sudo ln -s $WORKING_DIRECTORY/Tools/sockets-notes $WORKING_DIRECTORY/Prez/RTTSiteswap/libs/sockets-notes
echo "Set Link to reveal theme bootstrap"
sudo ln -s $WORKING_DIRECTORY/Tools/reveal-md-style-bootstrap $WORKING_DIRECTORY/Prez/RTTSiteswap/libs/reveal-md-style-bootstrap
echo "Set Link to HighlightJS"
sudo ln -s $WORKING_DIRECTORY/Tools/highlight.js $WORKING_DIRECTORY/Prez/RTTSiteswap/libs/highlight.js
echo "Set Link to HighlightJS Fix for reveal"
sudo ln -s $WORKING_DIRECTORY/Tools/highlight_reveal_fix_v8.0.js $WORKING_DIRECTORY/Prez/RTTSiteswap/libs/highlight_reveal_fix_v8.0.js
cd Prez/RTTSiteswap
sudo chmod 755 libs/