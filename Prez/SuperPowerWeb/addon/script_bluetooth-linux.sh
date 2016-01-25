#!/bin/bash
echo "Stop bluetooth"
sudo service bluetooth stop
echo "start bluetooth adapter"
sudo hciconfig hci0 up
