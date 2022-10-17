#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run this script as root by first run \"sudo su\" "
  exit
fi

echo "bringing down the network"

./network.sh down


./network.sh up cr

