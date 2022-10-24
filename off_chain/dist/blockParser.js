"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBlock = void 0;
const fabric_protos_1 = require("@hyperledger/fabric-protos");
const utils_1 = require("./utils");
function parseBlock(block) {
    const validationCodes = getTransactionValidationCodes(block);
    const header = (0, utils_1.assertDefined)(block.getHeader(), 'Missing block header');
    return {
        getNumber: () => BigInt(header.getNumber()),
        getTransactions: (0, utils_1.cache)(() => getPayloads(block)
            .map((payload, i) => parsePayload(payload, validationCodes[i]))
            .filter(payload => payload.isEndorserTransaction())
            .map(newTransaction)),
        toProto: () => block,
    };
}
exports.parseBlock = parseBlock;
function parsePayload(payload, statusCode) {
    const cachedChannelHeader = (0, utils_1.cache)(() => getChannelHeader(payload));
    const isEndorserTransaction = () => cachedChannelHeader().getType() === fabric_protos_1.common.HeaderType.ENDORSER_TRANSACTION;
    return {
        getChannelHeader: cachedChannelHeader,
        getEndorserTransaction: () => {
            if (!isEndorserTransaction()) {
                throw new Error(`Unexpected payload type: ${cachedChannelHeader().getType()}`);
            }
            const transaction = fabric_protos_1.peer.Transaction.deserializeBinary(payload.getData_asU8());
            return parseEndorserTransaction(transaction);
        },
        getSignatureHeader: (0, utils_1.cache)(() => getSignatureHeader(payload)),
        getTransactionValidationCode: () => statusCode,
        isEndorserTransaction,
        isValid: () => statusCode === fabric_protos_1.peer.TxValidationCode.VALID,
        toProto: () => payload,
    };
}
function parseEndorserTransaction(transaction) {
    return {
        getReadWriteSets: (0, utils_1.cache)(() => getChaincodeActionPayloads(transaction)
            .map(payload => (0, utils_1.assertDefined)(payload.getAction(), 'Missing chaincode endorsed action'))
            .map(endorsedAction => endorsedAction.getProposalResponsePayload_asU8())
            .map(bytes => fabric_protos_1.peer.ProposalResponsePayload.deserializeBinary(bytes))
            .map(responsePayload => fabric_protos_1.peer.ChaincodeAction.deserializeBinary(responsePayload.getExtension_asU8()))
            .map(chaincodeAction => chaincodeAction.getResults_asU8())
            .map(bytes => fabric_protos_1.ledger.rwset.TxReadWriteSet.deserializeBinary(bytes))
            .map(parseReadWriteSet)),
        toProto: () => transaction,
    };
}
function newTransaction(payload) {
    const transaction = payload.getEndorserTransaction();
    return {
        getChannelHeader: () => payload.getChannelHeader(),
        getCreator: () => payload.getSignatureHeader().getCreator_asU8(),
        getNamespaceReadWriteSets: () => transaction.getReadWriteSets()
            .flatMap(readWriteSet => readWriteSet.getNamespaceReadWriteSets()),
        getValidationCode: () => payload.getTransactionValidationCode(),
        isValid: () => payload.isValid(),
        toProto: () => payload.toProto(),
    };
}
function parseReadWriteSet(readWriteSet) {
    return {
        getNamespaceReadWriteSets: () => {
            if (readWriteSet.getDataModel() !== fabric_protos_1.ledger.rwset.TxReadWriteSet.DataModel.KV) {
                throw new Error(`Unexpected read/write set data model: ${readWriteSet.getDataModel()}`);
            }
            return readWriteSet.getNsRwsetList().map(parseNamespaceReadWriteSet);
        },
        toProto: () => readWriteSet,
    };
}
function parseNamespaceReadWriteSet(nsReadWriteSet) {
    return {
        getNamespace: () => nsReadWriteSet.getNamespace(),
        getReadWriteSet: (0, utils_1.cache)(() => fabric_protos_1.ledger.rwset.kvrwset.KVRWSet.deserializeBinary(nsReadWriteSet.getRwset_asU8())),
        toProto: () => nsReadWriteSet,
    };
}
function getTransactionValidationCodes(block) {
    const metadata = (0, utils_1.assertDefined)(block.getMetadata(), 'Missing block metadata');
    return metadata.getMetadataList_asU8()[fabric_protos_1.common.BlockMetadataIndex.TRANSACTIONS_FILTER];
}
function getPayloads(block) {
    return (block.getData()?.getDataList_asU8() ?? [])
        .map(bytes => fabric_protos_1.common.Envelope.deserializeBinary(bytes))
        .map(envelope => envelope.getPayload_asU8())
        .map(bytes => fabric_protos_1.common.Payload.deserializeBinary(bytes));
}
function getChannelHeader(payload) {
    const header = (0, utils_1.assertDefined)(payload.getHeader(), 'Missing payload header');
    return fabric_protos_1.common.ChannelHeader.deserializeBinary(header.getChannelHeader_asU8());
}
function getSignatureHeader(payload) {
    const header = (0, utils_1.assertDefined)(payload.getHeader(), 'Missing payload header');
    return fabric_protos_1.common.SignatureHeader.deserializeBinary(header.getSignatureHeader_asU8());
}
function getChaincodeActionPayloads(transaction) {
    return transaction.getActionsList()
        .map(transactionAction => transactionAction.getPayload_asU8())
        .map(bytes => fabric_protos_1.peer.ChaincodeActionPayload.deserializeBinary(bytes));
}
//# sourceMappingURL=blockParser.js.map