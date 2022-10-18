#!/usr/bin/env bash

#written by Huynh Minh Triet - Student ID: 17447

cd "$(git rev-parse --show-toplevel)/network" || exit

source ./scripts/utils.sh

# check if user is root to run the script
if [[ $EUID -ne 0 ]]; then
   errorln "This script must be run as root, press password to become root" 
   infoln "after pressing password, please run this script again" 
   sudo su
   exit 1
fi



# check if bin existed in root directory
if [ ! -d ../bin/ ]; then
  errorln "bin directory not found, the script is assuming that there exist a bin directory in the directory that has the all of the folders: config, chaincode, etc (on the same level)"
  infoln "Please copy the bin directory from the fabric-samples to the directory above"
  infoln "exiting the script..."
  exit 2
else
  export PATH=${PWD}/../bin:$PATH
fi

export FABRIC_CFG_PATH=$PWD/../config/
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

# PEER0_ORG1_CA=${DIR}/test-network/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
# PEER0_ORG2_CA=${DIR}/test-network/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem
# PEER0_ORG3_CA=${DIR}/test-network/organizations/peerOrganizations/org3.example.com/tlsca/tlsca.org3.example.com-cert.pem

switch_to_org1() {
    export FABRIC_CFG_PATH=$PWD/../config/
    export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

switch_to_org2() {
    export FABRIC_CFG_PATH=$PWD/../config/
    export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
}
switch_to_org3() {
    export FABRIC_CFG_PATH=$PWD/../config/
    export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org3MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
    export CORE_PEER_ADDRESS=localhost:11051
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    infoln "Network error (dont know why happens), please run \"manager reset\" "
    fatalln "$2"
  fi
}

function installChaincode() {
  ORG=$1
  if [ "$ORG" == "org1" ]; then
    switch_to_org1
  elif [ "$ORG" == "org2" ]; then
    switch_to_org2
  elif [ "$ORG" == "org3" ]; then
    switch_to_org3
  else
    errorln "Invalid organization name, please use org1, org2 or org3"
    exit 1
  fi
  set -x
  peer lifecycle chaincode queryinstalled --output json | jq -r 'try (.installed_chaincodes[].package_id)' | grep ^${CC_PACKAGE_ID}$ >&log.txt
  if test $? -ne 0; then
    peer lifecycle chaincode install ${CHAINCODE_NAME}_${CHAINCODE_VERSION}.tar.gz >&log.txt
    res=$?
  fi
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode installation on peer0.${ORG} has failed"
  successln "Chaincode is installed on peer0.${ORG}"
}

check_channel_exit() {
    # check if mychannel existed 
    if [[ ! -d ./channel-artifacts/ ]]; then
      errorln "Channel does not exist yet, please run \"manager reset\" first "
      exit 3
    fi
}

OPTION="$1"

case "$OPTION" in
    installed)
      check_channel_exit
      infoln "List all the chaincode installed on the peers"
      echo "--------------------------------------------------"
      switch_to_org1
      infoln "Org1: peer0.org1.example.com"
      peer lifecycle chaincode queryinstalled 
      echo "--------------------------------------------------"
      switch_to_org2
      infoln "Org2: peer0.org2.example.com"
      peer lifecycle chaincode queryinstalled
      echo "--------------------------------------------------"
      infoln "Org3: peer0.org3.example.com"
      switch_to_org3
      peer lifecycle chaincode queryinstalled
      ;;
    committed)
      check_channel_exit
      switch_to_org1
      infoln "Org1: peer0.org1.example.com"
      peer lifecycle chaincode querycommitted --channelID mychannel
      ;;

    deploy)
      check_channel_exit
      read -p "Enter the name of the chaincode: " -r CHAINCODE_NAME
      read -p "Enter the version of the chaincode: " -r CHAINCODE_VERSION
      infoln "Packaging chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION"
      peer lifecycle chaincode package "${CHAINCODE_NAME}"_"${CHAINCODE_VERSION}".tar.gz --path ../chaincode/ --lang node --label "${CHAINCODE_NAME}"_"${CHAINCODE_VERSION}"

      # if chaincode already installed skip this step
      infoln "Org1: Installing chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org1.example.com"
      installChaincode org1

      infoln "Org2: Installing chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org2.example.com"
      installChaincode org2

      infoln "Org3: Installing chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org3.example.com"
      installChaincode org3

      # getting the package ID
      infoln "Getting the package ID"
      switch_to_org1
      CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid "${CHAINCODE_NAME}"_"${CHAINCODE_VERSION}".tar.gz)

      infoln "Org1: Approving chaincode definition for $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org1.example.com"
      switch_to_org1
      peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "${CHAINCODE_NAME}" --version "${CHAINCODE_VERSION}" --package-id "${CC_PACKAGE_ID}" --sequence 1 --tls --cafile "$ORDERER_CA"
      echo "finished approving chaincode definition for org1"

      infoln "Org2: Approving chaincode definition for $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org2.example.com"
      switch_to_org2
      peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "${CHAINCODE_NAME}" --version "${CHAINCODE_VERSION}" --package-id "${CC_PACKAGE_ID}" --sequence 1 --tls --cafile "$ORDERER_CA"
      echo "finished approving chaincode definition for org2"

      infoln "Org3: Approving chaincode definition for $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org3.example.com"
      switch_to_org3
      peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "${CHAINCODE_NAME}" --version "${CHAINCODE_VERSION}" --package-id "${CC_PACKAGE_ID}" --sequence 1 --tls --cafile "$ORDERER_CA"
      echo "finished approving chaincode definition for org3"

      infoln "Current approval state"
      switch_to_org1
      peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name "${CHAINCODE_NAME}" --version "${CHAINCODE_VERSION}" --sequence 1 --tls --cafile "$ORDERER_CA" --output json

      read -p  "Continute to commit the chaincode definition? [y/n]" -r answer
      if [[ $answer != "y" ]]; then
        exit 0
      fi

      # committing the chaincode
      infoln "Org1: Committing chaincode definition for $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org1.example.com"
      switch_to_org1
      peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "${CHAINCODE_NAME}"  --version "${CHAINCODE_VERSION}"  --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" --peerAddresses localhost:11051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt"
      successln "chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION committed on channel mychannel"
      ;;

    upgrade) 
      check_channel_exit
      # upgrade chaincode
      read -p "Enter the name of the chaincode: " -r CHAINCODE_NAME
      #Getting the current version of the chaincode
      CURRENT_VERSION=$(find . -maxdepth 1 -name "${CHAINCODE_NAME}*.tar.gz" | cut -d'_' -f2 | cut -d'.' -f1)
      # get current sequnce
      switch_to_org1
      CURRENT_SEQUENCE=$(peer lifecycle chaincode querycommitted --channelID mychannel --name "${CHAINCODE_NAME}" | awk '{print $4}')
      CURRENT_SEQUENCE=$(echo "${CURRENT_SEQUENCE: -2}" | tr -d ',')
      # increment sequence
      NEW_SEQUENCE=$((CURRENT_SEQUENCE+1))

      infoln "Current version of the chaincode is: $CURRENT_VERSION"
      warnln "please increment this version for the upgrade"
      read -p "Enter the version of the chaincode: " -r CHAINCODE_VERSION

      infoln "Packaging chaincode ${CHAINCODE_NAME}_${CHAINCODE_VERSION}"
      peer lifecycle chaincode package "${CHAINCODE_NAME}"_"${CHAINCODE_VERSION}".tar.gz --path ../chaincode/ --lang node --label "${CHAINCODE_NAME}"_"${CHAINCODE_VERSION}"

      infoln "Org1: Installing chaincode ${CHAINCODE_NAME}_${CHAINCODE_VERSION} on peer0.org1.example.com"
      installChaincode org1

      infoln "Org2: Installing chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org2.example.com"
      installChaincode org2

      infoln "Org3: Installing chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org3.example.com"
      installChaincode org3

      # getting the package ID
      infoln "Getting the package ID"
      switch_to_org1
      CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid "${CHAINCODE_NAME}"_"${CHAINCODE_VERSION}".tar.gz)

      infoln "Org1: Approving chaincode definition for $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org1.example.com"
      switch_to_org1
      peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "${CHAINCODE_NAME}" --version "${CHAINCODE_VERSION}" --package-id "${CC_PACKAGE_ID}" --sequence "$NEW_SEQUENCE" --tls --cafile "$ORDERER_CA"
      echo "finished approving chaincode definition for org1"

      infoln "Org2: Approving chaincode definition for $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org2.example.com"
      switch_to_org2
      peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "${CHAINCODE_NAME}" --version "${CHAINCODE_VERSION}" --package-id "${CC_PACKAGE_ID}" --sequence "$NEW_SEQUENCE" --tls --cafile "$ORDERER_CA"
      echo "finished approving chaincode definition for org2"

      infoln "Org3: Approving chaincode definition for $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org3.example.com"
      switch_to_org3
      peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "${CHAINCODE_NAME}" --version "${CHAINCODE_VERSION}" --package-id "${CC_PACKAGE_ID}" --sequence "$NEW_SEQUENCE" --tls --cafile "$ORDERER_CA"
      echo "finished approving chaincode definition for org3"


      infoln "Current approval state"
      switch_to_org1
      peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name "${CHAINCODE_NAME}" --version "${CHAINCODE_VERSION}" --sequence "$NEW_SEQUENCE" --tls --cafile "$ORDERER_CA" --output json

      read -p  "Continute to commit the chaincode definition? [y/n]" -r answer
      if [[ $answer != "y" ]]; then
        exit 0
      fi

      # committing the chaincode
      infoln "Org1: Committing chaincode definition for $CHAINCODE_NAME:$CHAINCODE_VERSION on peer0.org1.example.com"
      switch_to_org1
      peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "${CHAINCODE_NAME}"  --version "${CHAINCODE_VERSION}"  --sequence "${NEW_SEQUENCE}" --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" --peerAddresses localhost:11051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt"
      successln "chaincode $CHAINCODE_NAME:$CHAINCODE_VERSION committed on channel mychannel"
      ;;
    down)
      ./network.sh down
      ;;
    reset|up)
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
        # gnome-terminal & disown
        alacritty & disown
      ;;
    o2)
        check_channel_exit
        switch_to_org2
        successln "Switched to org2"
        gnome-terminal & disown
      ;;
    o3) 
        check_channel_exit
        switch_to_org3
        successln "Switched to org3"
        gnome-terminal & disown
      ;;
    *)
      # option with flags
      infoln "Usage: manager.sh {installed|committed|deploy|upgrade|down|reset or up|o1|o2|o3}
      installed - List all the chaincode installed on the peers 
      committed - List all the chaincode committed on the channel
      deploy - deploy the chaincode
      upgrade - upgrade chaincode
      down - stop the network
      reset or up - start the network by first shutting down and booting back up, flags: -o 1,2,3
      o1 - switch to org1
      o2 - switch to org2
      o3 - switch to org3
      "
      exit 1
      ;;
esac
