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
var _BlockProcessor_instances, _BlockProcessor_block, _BlockProcessor_checkpointer, _BlockProcessor_store, _BlockProcessor_getNewTransactions, _TransactionProcessor_instances, _TransactionProcessor_blockNumber, _TransactionProcessor_transaction, _TransactionProcessor_store, _TransactionProcessor_getWrites;
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const util_1 = require("util");
const blockParser_1 = require("./blockParser");
const connect_1 = require("./connect");
const expectedError_1 = require("./expectedError");
const checkpointFile = path.resolve(process.env.CHECKPOINT_FILE ?? 'checkpoint.json');
const storeFile = path.resolve(process.env.STORE_FILE ?? 'store.log');
const simulatedFailureCount = getSimulatedFailureCount();
const startBlock = BigInt(0);
const utf8Decoder = new util_1.TextDecoder();
// Typically we should ignore read/write sets that apply to system chaincode namespaces.
const systemChaincodeNames = [
    '_lifecycle',
    'cscc',
    'escc',
    'lscc',
    'qscc',
    'vscc',
];
let transactionCount = 0; // Used only to simulate failures
/**
 * Apply writes for a given transaction to off-chain data store, ideally in a single operation for fault tolerance.
 * This implementation just writes to a file.
 */
const applyWritesToOffChainStore = async (data) => {
    simulateFailureIfRequired();
    const writes = data.writes
        .map(write => Object.assign({}, write, {
        value: utf8Decoder.decode(write.value), // Convert bytes to text, purely for readability in output
    }))
        .map(write => JSON.stringify(write));
    await fs_1.promises.appendFile(storeFile, writes.join('\n') + '\n');
};
async function main(client) {
    const connectOptions = await (0, connect_1.newConnectOptions)(client);
    const gateway = (0, fabric_gateway_1.connect)(connectOptions);
    try {
        const network = gateway.getNetwork(connect_1.channelName);
        const checkpointer = await fabric_gateway_1.checkpointers.file(checkpointFile);
        console.log(`Starting event listening from block ${checkpointer.getBlockNumber() ?? startBlock}`);
        console.log('Last processed transaction ID within block:', checkpointer.getTransactionId());
        if (simulatedFailureCount > 0) {
            console.log(`Simulating a write failure every ${simulatedFailureCount} transactions`);
        }
        const blocks = await network.getBlockEvents({
            checkpoint: checkpointer,
            startBlock, // Used only if there is no checkpoint block number
        });
        try {
            for await (const blockProto of blocks) {
                const blockProcessor = new BlockProcessor({
                    block: (0, blockParser_1.parseBlock)(blockProto),
                    checkpointer,
                    store: applyWritesToOffChainStore,
                });
                await blockProcessor.process();
            }
        }
        finally {
            blocks.close();
        }
    }
    finally {
        gateway.close();
    }
}
exports.main = main;
class BlockProcessor {
    constructor(options) {
        _BlockProcessor_instances.add(this);
        _BlockProcessor_block.set(this, void 0);
        _BlockProcessor_checkpointer.set(this, void 0);
        _BlockProcessor_store.set(this, void 0);
        __classPrivateFieldSet(this, _BlockProcessor_block, options.block, "f");
        __classPrivateFieldSet(this, _BlockProcessor_checkpointer, options.checkpointer, "f");
        __classPrivateFieldSet(this, _BlockProcessor_store, options.store, "f");
    }
    async process() {
        const blockNumber = __classPrivateFieldGet(this, _BlockProcessor_block, "f").getNumber();
        console.log(`\nReceived block ${blockNumber}`);
        const validTransactions = __classPrivateFieldGet(this, _BlockProcessor_instances, "m", _BlockProcessor_getNewTransactions).call(this)
            .filter(transaction => transaction.isValid());
        for (const transaction of validTransactions) {
            const transactionProcessor = new TransactionProcessor({
                blockNumber,
                store: __classPrivateFieldGet(this, _BlockProcessor_store, "f"),
                transaction,
            });
            await transactionProcessor.process();
            const transactionId = transaction.getChannelHeader().getTxId();
            await __classPrivateFieldGet(this, _BlockProcessor_checkpointer, "f").checkpointTransaction(blockNumber, transactionId);
        }
        await __classPrivateFieldGet(this, _BlockProcessor_checkpointer, "f").checkpointBlock(__classPrivateFieldGet(this, _BlockProcessor_block, "f").getNumber());
    }
}
_BlockProcessor_block = new WeakMap(), _BlockProcessor_checkpointer = new WeakMap(), _BlockProcessor_store = new WeakMap(), _BlockProcessor_instances = new WeakSet(), _BlockProcessor_getNewTransactions = function _BlockProcessor_getNewTransactions() {
    const transactions = __classPrivateFieldGet(this, _BlockProcessor_block, "f").getTransactions();
    const lastTransactionId = __classPrivateFieldGet(this, _BlockProcessor_checkpointer, "f").getTransactionId();
    if (!lastTransactionId) {
        // No previously processed transactions within this block so all are new
        return transactions;
    }
    // Ignore transactions up to the last processed transaction ID
    const blockTransactionIds = transactions.map(transaction => transaction.getChannelHeader().getTxId());
    const lastProcessedIndex = blockTransactionIds.indexOf(lastTransactionId);
    if (lastProcessedIndex < 0) {
        throw new Error(`Checkpoint transaction ID ${lastTransactionId} not found in block ${__classPrivateFieldGet(this, _BlockProcessor_block, "f").getNumber()} containing transactions: ${blockTransactionIds.join(', ')}`);
    }
    return transactions.slice(lastProcessedIndex + 1);
};
class TransactionProcessor {
    constructor(options) {
        _TransactionProcessor_instances.add(this);
        _TransactionProcessor_blockNumber.set(this, void 0);
        _TransactionProcessor_transaction.set(this, void 0);
        _TransactionProcessor_store.set(this, void 0);
        __classPrivateFieldSet(this, _TransactionProcessor_blockNumber, options.blockNumber, "f");
        __classPrivateFieldSet(this, _TransactionProcessor_transaction, options.transaction, "f");
        __classPrivateFieldSet(this, _TransactionProcessor_store, options.store, "f");
    }
    async process() {
        const channelHeader = __classPrivateFieldGet(this, _TransactionProcessor_transaction, "f").getChannelHeader();
        const transactionId = channelHeader.getTxId();
        const writes = __classPrivateFieldGet(this, _TransactionProcessor_instances, "m", _TransactionProcessor_getWrites).call(this);
        if (writes.length === 0) {
            console.log(`Skipping read-only or system transaction ${transactionId}`);
            return;
        }
        console.log(`Process transaction ${transactionId}`);
        await __classPrivateFieldGet(this, _TransactionProcessor_store, "f").call(this, {
            blockNumber: __classPrivateFieldGet(this, _TransactionProcessor_blockNumber, "f"),
            transactionId,
            writes,
        });
    }
}
_TransactionProcessor_blockNumber = new WeakMap(), _TransactionProcessor_transaction = new WeakMap(), _TransactionProcessor_store = new WeakMap(), _TransactionProcessor_instances = new WeakSet(), _TransactionProcessor_getWrites = function _TransactionProcessor_getWrites() {
    const channelName = __classPrivateFieldGet(this, _TransactionProcessor_transaction, "f").getChannelHeader().getChannelId();
    return __classPrivateFieldGet(this, _TransactionProcessor_transaction, "f").getNamespaceReadWriteSets()
        .filter(readWriteSet => !isSystemChaincode(readWriteSet.getNamespace()))
        .flatMap(readWriteSet => {
        const namespace = readWriteSet.getNamespace();
        return readWriteSet.getReadWriteSet().getWritesList().map(write => {
            return {
                channelName,
                namespace,
                key: write.getKey(),
                isDelete: write.getIsDelete(),
                value: write.getValue_asU8(),
            };
        });
    });
};
function isSystemChaincode(chaincodeName) {
    return systemChaincodeNames.includes(chaincodeName);
}
function getSimulatedFailureCount() {
    const value = process.env.SIMULATED_FAILURE_COUNT ?? '0';
    const count = Math.floor(Number(value));
    if (isNaN(count) || count < 0) {
        throw new Error(`Invalid SIMULATED_FAILURE_COUNT value: ${String(value)}`);
    }
    return count;
}
function simulateFailureIfRequired() {
    if (simulatedFailureCount > 0 && transactionCount++ >= simulatedFailureCount) {
        transactionCount = 0;
        throw new expectedError_1.ExpectedError('Simulated write failure');
    }
}
//# sourceMappingURL=listen.js.map