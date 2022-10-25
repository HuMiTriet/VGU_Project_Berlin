#!/bin/bash

source ./scripts/utils.sh

# registering org1 as a minter
register_org1() {
  PATH=${PWD}/../bin:${PWD}:$PATH
  FABRIC_CFG_PATH=$PWD/../config/
  FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org1.example.com/
  infoln "Registering minter indentity for Org1 (id.name: minter, id.secret minter.pw)"
  fabric-ca-client register --caname ca-org1 --id.name minter --id.secret minterpw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/org1/tls-cert.pem"
  infoln "Generating Org1 identity certificates and MSP folders"
  fabric-ca-client enroll -u https://minter:minterpw@localhost:7054 --caname ca-org1 -M "${PWD}/organizations/peerOrganizations/org1.example.com/users/minter@org1.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org1/tls-cert.pem"
  infoln "copying Node OU files for Org1"
  cp "${PWD}/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org1.example.com/users/minter@org1.example.com/msp/config.yaml"
}

register_org2

mint() {
  infoln "Currently only working on branch business first"

}
