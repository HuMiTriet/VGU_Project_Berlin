import { common, ledger } from '@hyperledger/fabric-protos';
export interface Block {
    getNumber(): bigint;
    getTransactions(): Transaction[];
    toProto(): common.Block;
}
export interface Transaction {
    getChannelHeader(): common.ChannelHeader;
    getCreator(): Uint8Array;
    getValidationCode(): number;
    isValid(): boolean;
    getNamespaceReadWriteSets(): NamespaceReadWriteSet[];
    toProto(): common.Payload;
}
export interface NamespaceReadWriteSet {
    getNamespace(): string;
    getReadWriteSet(): ledger.rwset.kvrwset.KVRWSet;
    toProto(): ledger.rwset.NsReadWriteSet;
}
export declare function parseBlock(block: common.Block): Block;
//# sourceMappingURL=blockParser.d.ts.map