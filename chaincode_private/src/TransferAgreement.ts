import { Object, Property } from 'fabric-contract-api'

const RED = '\x1b[31m\n';
const RESET = '\x1b[0m';
export function doFail(msgString: string): never {
    console.error(`${RED}\t${msgString}${RESET}`);
    throw new Error(msgString);
}

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

    public serialize(): Uint8Array { return new TextEncoder().encode(JSON.stringify(this)); }

    public static deserialize(assetJSON: Uint8Array): TransferAgreement {
        try {
            let json: JSON = JSON.parse(Buffer.from(assetJSON).toString('utf8'));
            return new TransferAgreement(json['_assetID'].toString(), json['_buyerID'].toString())
        } catch (err) { doFail(`Deserialize error DATA_ERROR: ${err}`) }
    }
}