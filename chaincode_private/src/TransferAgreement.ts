import { Object, Property } from 'fabric-contract-api'

@Object()
export class TransferAgreement {
    @Property()
    private assetID: string;

    @Property()
    private buyerID: string;

    constructor(assetID: string, buyerID: string) {
        this.assetID = assetID;
        this.buyerID = buyerID;
    }
}