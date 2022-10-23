import { Object, Property } from 'fabric-contract-api'

@Object()
export class AssetPrivateDetails {
    @Property()
    private _assetID: string;

    public get assetID(): string {
        return this._assetID
    }

    public set assetID(value: string) {
        this._assetID = value
    }

    @Property()
    private _appraisedValue: number

    public get apprivsedValue(): number {
        return this._appraisedValue
    }

    public set appraisedValue(value: number) {
        this._appraisedValue = value
    }

    constructor(assetID: string, appraisedValue: number) {
        this._assetID = assetID;
        this._appraisedValue = appraisedValue;
    }

    public serialize(): Uint8Array {
        let jsonStr: string = JSON.stringify(this);
        return new TextEncoder().encode(jsonStr);
    }
}