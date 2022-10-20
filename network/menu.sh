#!/bin/bash

while :
do
    cat<<EOF
-----------------
|   0. Quit
|   1. Clear
|   2. Initialize the ledger with assets
|   3. Get all assets
|   4. Transfer asset 
-----------------
EOF
    echo -n ">> "
    read 
    case "$REPLY" in
    "0") exit ;;
    "1") clear ;; 
    "2") peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}' ;;
    "3") peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAssets"]}' ;;
    "4") 
            read -p "Enter sell asset: " sellAsset; 
            read -p "Enter seller: " seller;
            read -p "Enter buyer: " buyer;
            read -p "Enter buy percentage: " buyPercentage;

            if [[ "$sellAsset" == "" ]]; 
            then sellAsset="asset1" ; 
            fi; 
            echo "Set default sell asset => ${sellAsset}";
            
            if [[ "$seller" == "" ]];
            then seller="user1" ; 
            fi; 
            echo "Set default seller => ${seller}";

            if [[ "$buyer" == "" ]];
            then buyer="user2" ; 
            fi; 
            echo "Set default buyer => ${buyer}";

            if [[ "$buyPercentage" == "" ]];
            then buyPercentage="5" ; 
            fi; 
            echo "Set default buy percentage => ${buyPercentage}";

            # peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"TransferAsset","Args":["asset1","user1","user2","5"]}'
            peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"TransferAsset","Args":["${sellAsset}","$seller","$buyer","$buyPercentage"]}'
            # peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c "{\'function\':\'TransferAsset\',\'Args\':[${sellAsset},${seller},${buyer},${buyPercentage}]}"
            ;; 
     * )  echo "invalid option"     ;;
    esac
done
