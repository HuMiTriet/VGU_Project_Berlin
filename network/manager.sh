#!/usr/bin/env bash

# check if user is root to run the script
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root, press password to become root" 
   echo "after pressing password, please run this script again" 
   sudo su
   exit 1
fi

cd "$(git rev-parse --show-toplevel)/network" || exit

# check if bin existed in root directory
if [ ! -d ../bin/ ]; then
  echo "bin directory not found, the script is assuming that there exist a bin directory in root directory"
  echo "exiting the script..."
  exit 2
else
  export PATH=${PWD}/../bin:$PATH
fi

export FABRIC_CFG_PATH=$PWD/../config/
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

OPTION="$1"

case "$OPTION" in
    s)
      ./network.sh down
      ./network.sh up createChannel -ca -s couchdb
      ;;
    o1) 
      echo "Switching to org1"
        export CORE_PEER_TLS_ENABLED=true
        export CORE_PEER_LOCALMSPID="Org1MSP"
        export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
        export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
        export CORE_PEER_ADDRESS=localhost:7051
      ;;
    o2)
      echo "Switching to org2"
        export CORE_PEER_TLS_ENABLED=true
        export CORE_PEER_LOCALMSPID="Org2MSP"
        export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
        export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
        export CORE_PEER_ADDRESS=localhost:9051
      ;;
    *)
      echo "must specify orgaization: o1, o2 to switch to that organization or s to start the network"
      exit 1
      ;;
  esac
