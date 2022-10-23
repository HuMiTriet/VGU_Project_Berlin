import { Object, Property } from 'fabric-contract-api'

@Object()
export class TransferAgreement {
    @Property()
    private _assetID: string;
    public get assetID(): string { return this._assetID; }
    public set assetID(value: string) { this._assetID = value }

    @Property()
    private _buyerID: string;
    public get buyerID(): string { return this._buyerID; }
    public set buyerID(value: string) { this._buyerID = value }

    constructor(assetID: string, buyerID: string) {
        this._assetID = assetID;
        this._buyerID = buyerID;
    }
}