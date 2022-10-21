import { Object, Property } from 'fabric-contract-api'

@Object()
export class AssetPrivateDetails {
    @Property()
    private assetID: string;

    @Property()
    private appraisedValue: number

    public getAssetID(): string {
        return this.assetID;
    }

    public getAppraisedValue(): number {
        return this.appraisedValue;
    }

    public AssetPrivateDetails(assetID: string, appraisedValue: number) {
        this.assetID = assetID;
        this.appraisedValue = appraisedValue;
    }
}