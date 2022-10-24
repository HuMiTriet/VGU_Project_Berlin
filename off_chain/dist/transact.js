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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TransactApp_instances, _TransactApp_smartContract, _TransactApp_batchSize, _TransactApp_transact, _TransactApp_newAsset;
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const crypto = __importStar(require("crypto"));
const connect_1 = require("./connect");
const contract_1 = require("./contract");
const utils_1 = require("./utils");
async function main(client) {
    const connectOptions = await (0, connect_1.newConnectOptions)(client);
    const gateway = (0, fabric_gateway_1.connect)(connectOptions);
    try {
        const network = gateway.getNetwork(connect_1.channelName);
        const contract = network.getContract(connect_1.chaincodeName);
        const smartContract = new contract_1.AssetTransferBasic(contract);
        const app = new TransactApp(smartContract);
        await app.run();
    }
    finally {
        gateway.close();
    }
}
exports.main = main;
const colors = ['red', 'green', 'blue'];
const owners = ['alice', 'bob', 'charlie'];
const maxInitialValue = 1000;
const maxInitialSize = 10;
class TransactApp {
    constructor(smartContract) {
        _TransactApp_instances.add(this);
        _TransactApp_smartContract.set(this, void 0);
        _TransactApp_batchSize.set(this, 10);
        __classPrivateFieldSet(this, _TransactApp_smartContract, smartContract, "f");
    }
    async run() {
        const promises = Array.from({ length: __classPrivateFieldGet(this, _TransactApp_batchSize, "f") }, () => __classPrivateFieldGet(this, _TransactApp_instances, "m", _TransactApp_transact).call(this));
        await (0, utils_1.allFulfilled)(promises);
    }
}
_TransactApp_smartContract = new WeakMap(), _TransactApp_batchSize = new WeakMap(), _TransactApp_instances = new WeakSet(), _TransactApp_transact = async function _TransactApp_transact() {
    const asset = __classPrivateFieldGet(this, _TransactApp_instances, "m", _TransactApp_newAsset).call(this);
    await __classPrivateFieldGet(this, _TransactApp_smartContract, "f").createAsset(asset);
    console.log(`Created asset ${asset.ID}`);
    // Transfer randomly 1 in 2 assets to a new owner.
    if ((0, utils_1.randomInt)(2) === 0) {
        const newOwner = (0, utils_1.differentElement)(owners, asset.Owner);
        const oldOwner = await __classPrivateFieldGet(this, _TransactApp_smartContract, "f").transferAsset(asset.ID, newOwner);
        console.log(`Transferred asset ${asset.ID} from ${oldOwner} to ${newOwner}`);
    }
    // Delete randomly 1 in 4 created assets.
    if ((0, utils_1.randomInt)(4) === 0) {
        await __classPrivateFieldGet(this, _TransactApp_smartContract, "f").deleteAsset(asset.ID);
        console.log(`Deleted asset ${asset.ID}`);
    }
}, _TransactApp_newAsset = function _TransactApp_newAsset() {
    return {
        ID: crypto.randomUUID(),
        Color: (0, utils_1.randomElement)(colors),
        Size: (0, utils_1.randomInt)(maxInitialSize) + 1,
        Owner: (0, utils_1.randomElement)(owners),
        AppraisedValue: (0, utils_1.randomInt)(maxInitialValue) + 1,
    };
};
//# sourceMappingURL=transact.js.map