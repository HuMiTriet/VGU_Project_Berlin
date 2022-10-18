"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var grpc = require("@grpc/grpc-js");
var fabric_gateway_1 = require("@hyperledger/fabric-gateway");
var crypto = require("crypto");
var fs_1 = require("fs");
var path = require("path");
var util_1 = require("util");
var channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
var chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
var mspId = envOrDefault('MSP_ID', 'Org1MSP');
// Path to crypto materials.
var cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));
// Path to user private key directory.
var keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));
// Path to user certificate.
var certPath = envOrDefault('CERT_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts', 'cert.pem'));
// Path to peer tls certificate.
var tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));
// Gateway peer endpoint.
var peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');
// Gateway peer SSL host name override.
var peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');
var utf8Decoder = new util_1.TextDecoder();
var assetId = "asset".concat(Date.now());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var client, gateway, _a, network, contract;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, displayInputParameters()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, newGrpcConnection()];
                case 2:
                    client = _c.sent();
                    _a = fabric_gateway_1.connect;
                    _b = {
                        client: client
                    };
                    return [4 /*yield*/, newIdentity()];
                case 3:
                    _b.identity = _c.sent();
                    return [4 /*yield*/, newSigner()];
                case 4:
                    gateway = _a.apply(void 0, [(_b.signer = _c.sent(),
                            // Default timeouts for different gRPC calls
                            _b.evaluateOptions = function () {
                                return { deadline: Date.now() + 5000 }; // 5 seconds
                            },
                            _b.endorseOptions = function () {
                                return { deadline: Date.now() + 15000 }; // 15 seconds
                            },
                            _b.submitOptions = function () {
                                return { deadline: Date.now() + 5000 }; // 5 seconds
                            },
                            _b.commitStatusOptions = function () {
                                return { deadline: Date.now() + 60000 }; // 1 minute
                            },
                            _b)]);
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, , 13, 14]);
                    network = gateway.getNetwork(channelName);
                    contract = network.getContract(chaincodeName);
                    // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
                    return [4 /*yield*/, initLedger(contract)];
                case 6:
                    // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
                    _c.sent();
                    // Return all the current assets on the ledger.
                    return [4 /*yield*/, getAllAssets(contract)];
                case 7:
                    // Return all the current assets on the ledger.
                    _c.sent();
                    // Create a new asset on the ledger.
                    return [4 /*yield*/, createAsset(contract)];
                case 8:
                    // Create a new asset on the ledger.
                    _c.sent();
                    // Update an existing asset asynchronously.
                    return [4 /*yield*/, transferAssetAsync(contract)];
                case 9:
                    // Update an existing asset asynchronously.
                    _c.sent();
                    // Get the asset details by assetID.
                    return [4 /*yield*/, readAssetByID(contract)];
                case 10:
                    // Get the asset details by assetID.
                    _c.sent();
                    // Update an asset which does not exist.
                    return [4 /*yield*/, updateNonExistentAsset(contract)
                        // Hello
                    ];
                case 11:
                    // Update an asset which does not exist.
                    _c.sent();
                    // Hello
                    return [4 /*yield*/, hello()];
                case 12:
                    // Hello
                    _c.sent();
                    return [3 /*break*/, 14];
                case 13:
                    gateway.close();
                    client.close();
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
main()["catch"](function (error) {
    console.error('******** FAILED to run the application:', error);
    process.exitCode = 1;
});
function hello() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Hello");
            return [2 /*return*/];
        });
    });
}
function newGrpcConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var tlsRootCert, tlsCredentials;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(tlsCertPath)];
                case 1:
                    tlsRootCert = _a.sent();
                    tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
                    return [2 /*return*/, new grpc.Client(peerEndpoint, tlsCredentials, {
                            'grpc.ssl_target_name_override': peerHostAlias
                        })];
            }
        });
    });
}
function newIdentity() {
    return __awaiter(this, void 0, void 0, function () {
        var credentials;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(certPath)];
                case 1:
                    credentials = _a.sent();
                    return [2 /*return*/, { mspId: mspId, credentials: credentials }];
            }
        });
    });
}
function newSigner() {
    return __awaiter(this, void 0, void 0, function () {
        var files, keyPath, privateKeyPem, privateKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readdir(keyDirectoryPath)];
                case 1:
                    files = _a.sent();
                    keyPath = path.resolve(keyDirectoryPath, files[0]);
                    return [4 /*yield*/, fs_1.promises.readFile(keyPath)];
                case 2:
                    privateKeyPem = _a.sent();
                    privateKey = crypto.createPrivateKey(privateKeyPem);
                    return [2 /*return*/, fabric_gateway_1.signers.newPrivateKeySigner(privateKey)];
            }
        });
    });
}
/**
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
function initLedger(contract) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
                    return [4 /*yield*/, contract.submitTransaction('InitLedger')];
                case 1:
                    _a.sent();
                    console.log('*** Transaction committed successfully');
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Evaluate a transaction to query ledger state.
 */
function getAllAssets(contract) {
    return __awaiter(this, void 0, void 0, function () {
        var resultBytes, resultJson, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
                    return [4 /*yield*/, contract.evaluateTransaction('GetAllAssets')];
                case 1:
                    resultBytes = _a.sent();
                    resultJson = utf8Decoder.decode(resultBytes);
                    result = JSON.parse(resultJson);
                    console.log('*** Result:', result);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Submit a transaction synchronously, blocking until it has been committed to the ledger.
 */
function createAsset(contract) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments');
                    return [4 /*yield*/, contract.submitTransaction('CreateAsset', assetId, 'yellow', '5', 'Tom', '1300')];
                case 1:
                    _a.sent();
                    console.log('*** Transaction committed successfully');
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 */
function transferAssetAsync(contract) {
    return __awaiter(this, void 0, void 0, function () {
        var commit, oldOwner, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Async Submit Transaction: TransferAsset, updates existing asset owner');
                    return [4 /*yield*/, contract.submitAsync('TransferAsset', {
                            arguments: [assetId, 'Saptha']
                        })];
                case 1:
                    commit = _a.sent();
                    oldOwner = utf8Decoder.decode(commit.getResult());
                    console.log("*** Successfully submitted transaction to transfer ownership from ".concat(oldOwner, " to Saptha"));
                    console.log('*** Waiting for transaction commit');
                    return [4 /*yield*/, commit.getStatus()];
                case 2:
                    status = _a.sent();
                    if (!status.successful) {
                        throw new Error("Transaction ".concat(status.transactionId, " failed to commit with status code ").concat(status.code));
                    }
                    console.log('*** Transaction committed successfully');
                    return [2 /*return*/];
            }
        });
    });
}
function readAssetByID(contract) {
    return __awaiter(this, void 0, void 0, function () {
        var resultBytes, resultJson, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');
                    return [4 /*yield*/, contract.evaluateTransaction('ReadAsset', assetId)];
                case 1:
                    resultBytes = _a.sent();
                    resultJson = utf8Decoder.decode(resultBytes);
                    result = JSON.parse(resultJson);
                    console.log('*** Result:', result);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * submitTransaction() will throw an error containing details of any error responses from the smart contract.
 */
function updateNonExistentAsset(contract) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, contract.submitTransaction('UpdateAsset', 'asset70', 'blue', '5', 'Tomoko', '300')];
                case 2:
                    _a.sent();
                    console.log('******** FAILED to return an error');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log('*** Successfully caught the error: \n', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key, defaultValue) {
    return process.env[key] || defaultValue;
}
/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
function displayInputParameters() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("channelName:       ".concat(channelName));
            console.log("chaincodeName:     ".concat(chaincodeName));
            console.log("mspId:             ".concat(mspId));
            console.log("cryptoPath:        ".concat(cryptoPath));
            console.log("keyDirectoryPath:  ".concat(keyDirectoryPath));
            console.log("certPath:          ".concat(certPath));
            console.log("tlsCertPath:       ".concat(tlsCertPath));
            console.log("peerEndpoint:      ".concat(peerEndpoint));
            console.log("peerHostAlias:     ".concat(peerHostAlias));
            return [2 /*return*/];
        });
    });
}
