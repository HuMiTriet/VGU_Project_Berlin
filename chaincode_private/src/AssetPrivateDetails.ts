import { Object, Property } from 'fabric-contract-api'

@Object()
export class AssetPrivateDetails {
    @Property()
    private assetID: string;

    @Property()
    private appraisedValue: number

    constructor(assetID: string, appraisedValue: number) {
        this.assetID = assetID;
        this.appraisedValue = appraisedValue;
    }
}