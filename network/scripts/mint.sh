#!/bin/bash

source ./scripts/utils.sh

switch_to_org1_token() {
  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_LOCALMSPID="Org1MSP"
  export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/minter@org1.example.com/msp
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
  export CORE_PEER_ADDRESS=localhost:7051
  export TARGET_TLS_OPTIONS=(-o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt")
}

# registering org1 as a minter
register_org1() {
  PATH=${PWD}/../bin:${PWD}:$PATH
  FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org1.example.com/
  infoln "Registering minter indentity for Org1 (id.name: minter, id.secret minter.pw)"
  fabric-ca-client register --caname ca-org1 --id.name minter --id.secret minterpw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/org1/tls-cert.pem"
  infoln "Generating Org1 identity certificates and MSP folders"
  fabric-ca-client enroll -u https://minter:minterpw@localhost:7054 --caname ca-org1 -M "${PWD}/organizations/peerOrganizations/org1.example.com/users/minter@org1.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org1/tls-cert.pem"
  infoln "copying Node OU files for Org1"
  cp "${PWD}/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org1.example.com/users/minter@org1.example.com/msp/config.yaml"
}

register_org2() {
  PATH=${PWD}/../bin:${PWD}:$PATH
  FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org2.example.com/
  fabric-ca-client register --caname ca-org2 --id.name recipient --id.secret recipientpw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/org2/tls-cert.pem"
  fabric-ca-client enroll -u https://recipient:recipientpw@localhost:8054 --caname ca-org2 -M "${PWD}/organizations/peerOrganizations/org2.example.com/users/recipient@org2.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org2/tls-cert.pem"
  cp "${PWD}/organizations/peerOrganizations/org2.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org2.example.com/users/recipient@org2.example.com/msp/config.yaml"
}

# register_org2

mint_business() {
  # cd ..
  cd ..
  export FABRIC_CFG_PATH=$PWD/config/
  cd ./network/ || exit
  warnln "$FABRIC_CFG_PATH"

  infoln "minting coin on channel business"
  register_org1
  register_org2
  switch_to_org1_token
  export PATH="${PWD}/../bin:${PWD}:$PATH"
  export FABRIC_CFG_PATH=$PWD/../config/
  peer chaincode invoke "${TARGET_TLS_OPTIONS[@]}" -C "$CHANNEL_NAME" -n token_erc20 -c '{"function":"Initialize","Args":["inital sum", "currywurst", "2"]}'
  peer chaincode invoke "${TARGET_TLS_OPTIONS[@]}" -C "$CHANNEL_NAME" -n token_erc20 -c '{"function":"Mint","Args":["5000"]}'
  infoln "Total amount of the minter"
  peer chaincode query -C mychannel -n token_erc20 -c '{"function":"ClientAccountBalance","Args":[]}'
}

mint() {
  mint_business
}

export -f mint
