"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newConnectOptions = exports.newGrpcConnection = exports.chaincodeName = exports.channelName = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const crypto = __importStar(require("crypto"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
exports.channelName = process.env.CHANNEL_NAME || "mychannel";
exports.chaincodeName = process.env.CHAINCODE_NAME || "basic";
const peerName = "peer0.org1.example.com";
const mspId = process.env.MSP_ID || "Org1MSP";
// Path to crypto materials.
const cryptoPath = path.resolve(process.env.CRYPTO_PATH ||
    path.resolve(__dirname, "..", "..", "network", "organizations", "peerOrganizations", "org1.example.com"));
// Path to user private key directory.
const keyDirectoryPath = path.resolve(process.env.KEY_DIRECTORY_PATH ||
    path.resolve(__dirname, cryptoPath, "users", "User1@org1.example.com", "msp", "keystore"));
// Path to user certificate.
const certPath = path.resolve(process.env.CERT_PATH ||
    path.resolve(__dirname, cryptoPath, "users", "User1@org1.example.com", "msp", "signcerts", "cert.pem"));
// Path to peer tls certificate.
const tlsCertPath = path.resolve(process.env.TLS_CERT_PATH ||
    path.resolve(__dirname, cryptoPath, "peers", peerName, "tls", "ca.crt"));
// Gateway peer endpoint.
const peerEndpoint = process.env.PEER_ENDPOINT || "localhost:7051";
// Gateway peer SSL host name override.
const peerHostAlias = process.env.PEER_HOST_ALIAS || peerName;
async function newGrpcConnection() {
    const tlsRootCert = await fs_1.promises.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        "grpc.ssl_target_name_override": peerHostAlias,
    });
}
exports.newGrpcConnection = newGrpcConnection;
async function newConnectOptions(client) {
    return {
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    };
}
exports.newConnectOptions = newConnectOptions;
async function newIdentity() {
    const credentials = await fs_1.promises.readFile(certPath);
    return { mspId, credentials };
}
async function newSigner() {
    const keyFiles = await fs_1.promises.readdir(keyDirectoryPath);
    if (keyFiles.length === 0) {
        throw new Error(`No private key files found in directory ${keyDirectoryPath}`);
    }
    const keyPath = path.resolve(keyDirectoryPath, keyFiles[0]);
    const privateKeyPem = await fs_1.promises.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return fabric_gateway_1.signers.newPrivateKeySigner(privateKey);
}
//# sourceMappingURL=connect.js.map