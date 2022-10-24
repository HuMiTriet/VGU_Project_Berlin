import { Contract } from '@hyperledger/fabric-gateway';
export interface Asset {
    ID: string;
    Color: string;
    Size: number;
    Owner: string;
    AppraisedValue: number;
}
export declare class AssetTransferBasic {
    #private;
    constructor(contract: Contract);
    createAsset(asset: Asset): Promise<void>;
    transferAsset(id: string, newOwner: string): Promise<string>;
    deleteAsset(id: string): Promise<void>;
    getAllAssets(): Promise<Asset[]>;
}
//# sourceMappingURL=contract.d.ts.map