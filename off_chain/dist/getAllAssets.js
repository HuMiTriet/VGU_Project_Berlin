"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const connect_1 = require("./connect");
const contract_1 = require("./contract");
async function main(client) {
    const connectOptions = await (0, connect_1.newConnectOptions)(client);
    const gateway = (0, fabric_gateway_1.connect)(connectOptions);
    try {
        const network = gateway.getNetwork(connect_1.channelName);
        const contract = network.getContract(connect_1.chaincodeName);
        const smartContract = new contract_1.AssetTransferBasic(contract);
        const assets = await smartContract.getAllAssets();
        const assetsJson = JSON.stringify(assets, undefined, 2);
        assetsJson.split('\n').forEach(line => console.log(line)); // Write line-by-line to avoid truncation
    }
    finally {
        gateway.close();
    }
}
exports.main = main;
//# sourceMappingURL=getAllAssets.js.map