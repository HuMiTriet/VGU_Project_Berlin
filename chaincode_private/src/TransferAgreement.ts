import { Object, Property } from 'fabric-contract-api'

@Object()
export class TransferAgreement {
    @Property()
    private assetID: string;

    @Property()
    private buyerID: string;

    public getAssetID(): string {
        return this.assetID;
    }

    public getBuyerID(): string {
        return this.buyerID;
    }

    public TransferAgreement(assetID: string, buyerID: string) {
        this.assetID = assetID;
        this.buyerID = buyerID;
    }
}