import { Object, Property } from 'fabric-contract-api'

const RED = '\x1b[31m\n';
const RESET = '\x1b[0m';
export function doFail(msgString: string): never {
    console.error(`${RED}\t${msgString}${RESET}`);
    throw new Error(msgString);
}

@Object()
export class AssetPrivateDetails {
    @Property()
    private _assetID: string;
    public get assetID(): string { return this._assetID }
    public set assetID(value: string) { this._assetID = value }

    @Property()
    private _appraisedValue: number
    public get apprivsedValue(): number { return this._appraisedValue }
    public set appraisedValue(value: number) { this._appraisedValue = value }

    constructor(assetID: string, appraisedValue: number) {
        this._assetID = assetID;
        this._appraisedValue = appraisedValue;
    }

    public serialize(): Uint8Array {
        let jsonStr: string = JSON.stringify(this);
        return new TextEncoder().encode(jsonStr);
    }

    public static deserialize(assetJSON: Uint8Array): AssetPrivateDetails {
        try {
            let json: JSON = JSON.parse(Buffer.from(assetJSON).toString('utf8'));
            return new AssetPrivateDetails(json['_assetID'].toString(), json['_appraisedValue'].toString())
        } catch (err) { doFail(`Deserialize error DATA_ERROR: ${err}`) }
    }
}