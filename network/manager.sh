#!/usr/bin/env bash

#written by Huynh Minh Triet - Student ID: 17447

# check if user is root to run the script
if [[ $EUID -ne 0 ]]; then
   errorln "This script must be run as root, press password to become root" 
   info "after pressing password, please run this script again" 
   sudo su
   exit 1
fi

source ./scripts/utils.sh

cd "$(git rev-parse --show-toplevel)/network" || exit

# check if bin existed in root directory
if [ ! -d ../bin/ ]; then
  errorln "bin directory not found, the script is assuming that there exist a bin directory in the directory that has the README.md file"
  infoln "Please copy the bin directory from the fabric-samples to the directory with the README.md file"
  infoln "exiting the script..."
  exit 2
else
  export PATH=${PWD}/../bin:$PATH
fi

export FABRIC_CFG_PATH=$PWD/../config/
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

switch_to_org1() {
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

switch_to_org2() {
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
}
switch_to_org3() {
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org3MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
    export CORE_PEER_ADDRESS=localhost:11051
}

check_channel_exit() {
    # check if mychannel existed 
    if [[ ! -d ./channel-artifacts/ ]]; then
      errorln "Channel does not exist yet, please run \"manager up\" first "
      exit 3
    fi
}

OPTION="$1"

case "$OPTION" in
    deploy)
      check_channel_exit
      read -p "Enter the name of the chaincode: " -r CHAINCODE_NAME
      read -p "Enter the version of the chaincode: " -r CHAINCODE_VERSION
      infoln "Packaging chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION"
      peer lifecycle chaincode package "${CHAINCODE_NAME}".tar.gz --path ../chaincode/ --lang node --label "${CHAINCODE_NAME}"_"${CHAINCODE_VERSION}"
      infoln "Org1: Installing chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org1.example.com"
      switch_to_org1
      peer lifecycle chaincode install "${CHAINCODE_NAME}".tar.gz

      if [[ $? -ne 0 ]]; then
        errorln "Org1: Failed to install chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org1.example.com"
        exit 4
      fi

      infoln "Org2: Installing chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org2.example.com"
      switch_to_org2
      peer lifecycle chaincode install "${CHAINCODE_NAME}".tar.gz
      if [[ $? -ne 0 ]]; then
        errorln "Org2: Failed to install chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org2.example.com"
        exit 5
      fi

      infoln "Org3: Installing chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org3.example.com"
      switch_to_org3
      peer lifecycle chaincode install "${CHAINCODE_NAME}".tar.gz

      if [[ $? -ne 0 ]]; then
        errorln "Org3: Failed to install chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org3.example.com"
        exit 6
      fi

      ;;
    down)
      ./network.sh down
      ;;
    up)
      ./network.sh down
      ./network.sh up createChannel -s couchdb -ca
      infoln "adding Org 3 !!"
      cd addOrg3 || exit
      ./addOrg3.sh up -c mychannel -s couchdb -ca 
      successln "exist three organizations each with 1 peer use o1, o2, o3 to switch between"
      ;;
    o1) 
        check_channel_exit
        switch_to_org1
        successln "Switched to org1"
      ;;
    o2)
        check_channel_exit
        switch_to_org2
        successln "Switched to org2"
      ;;
    o3) 
        check_channel_exit
        switch_to_org3
        successln "Switched to org3"
      ;;
    *)
      infoln "Usage: manager.sh {deploy|upgrade|stop|start|o1|o2|o3}  
      deploy - deploy the chaincode
      upgrade - upgrade chaincode
      down - stop the network
      up - start the network
      o1 - switch to org1
      o2 - switch to org2
      "
      exit 1
      ;;
esac
