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

    public serialize(): Uint8Array {
        let jsonStr: string = JSON.stringify(this);
        return new TextEncoder().encode(jsonStr);
    }
}