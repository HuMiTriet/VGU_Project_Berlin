"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
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
var _AssetTransferBasic_contract;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetTransferBasic = void 0;
const util_1 = require("util");
const utf8Decoder = new util_1.TextDecoder();
class AssetTransferBasic {
    constructor(contract) {
        _AssetTransferBasic_contract.set(this, void 0);
        __classPrivateFieldSet(this, _AssetTransferBasic_contract, contract, "f");
    }
    async createAsset(asset) {
        await __classPrivateFieldGet(this, _AssetTransferBasic_contract, "f").submit('CreateAsset', {
            arguments: [asset.ID, asset.Color, String(asset.Size), asset.Owner, String(asset.AppraisedValue)],
        });
    }
    async transferAsset(id, newOwner) {
        const result = await __classPrivateFieldGet(this, _AssetTransferBasic_contract, "f").submit('TransferAsset', {
            arguments: [id, newOwner],
        });
        return utf8Decoder.decode(result);
    }
    async deleteAsset(id) {
        await __classPrivateFieldGet(this, _AssetTransferBasic_contract, "f").submit('DeleteAsset', {
            arguments: [id],
        });
    }
    async getAllAssets() {
        const result = await __classPrivateFieldGet(this, _AssetTransferBasic_contract, "f").evaluate('GetAllAssets');
        if (result.length === 0) {
            return [];
        }
        return JSON.parse(utf8Decoder.decode(result));
    }
}
exports.AssetTransferBasic = AssetTransferBasic;
_AssetTransferBasic_contract = new WeakMap();
//# sourceMappingURL=contract.js.map