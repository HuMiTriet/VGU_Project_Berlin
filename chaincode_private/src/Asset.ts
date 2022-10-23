import { Object, Property } from 'fabric-contract-api'
import { Md5 } from 'ts-md5';

const RED = '\x1b[31m\n';
const RESET = '\x1b[0m';
export function doFail(msgString: string): never {
    console.error(`${RED}\t${msgString}${RESET}`);
    throw new Error(msgString);
}

@Object()
export class RealEstate {
    @Property()
    private _docType?: string
    public get docType(): string { return this._docType }
    public set docType(value: string) { this._docType = value }

    @Property()
    private _assetID: string
    public get assetID(): string { return this._assetID }
    public set assetID(value: string) { this._assetID = value }

    @Property()
    private _area: number
    public get area(): number { return this._area }
    public set area(value: number) { this._area = value }

    @Property()
    private _location: string
    public get location(): string { return this._location }
    public set location(value: string) { this._location = value }

    @Property()
    private _owner: string
    public get owner(): string { return this._owner }
    public set owner(value: string) { this._owner = value }

    @Property()
    private _appraisedValues: number
    public get appraisedValues(): number { return this._appraisedValues }
    public set appraisedValues(value: number) { this._appraisedValues = value }

    constructor(assetID: string,
        area: number, location: string,
        owner: string, appraisedValues: number) {
        this._assetID = assetID;
        this._area = area;
        this._owner = owner;
        this._location = location;
        this._appraisedValues = appraisedValues;
    }

    public hashCode(): string {
        let md5 = new Md5();
        md5.appendStr(this._assetID)
            .appendStr(<any>this._area)
            .appendStr(this._location)
        return <string>md5.end()
    }

    public serialize(): Uint8Array { return new TextEncoder().encode(JSON.stringify(this)); }

    public static deserialize(assetJSON: Uint8Array): RealEstate {
        try {
            let json: JSON = JSON.parse(Buffer.from(assetJSON).toString('utf8'));
            return new RealEstate(json['_assetID'].toString(),
                json['_area'].toString(),
                json['_owner'].toString(),
                json['_location'].toString(),
                json['_appraisedValues'].toString());
        }
        catch (err) { doFail(`Deserialize error DATA_ERROR: ${err}`) }
    }
    public toString = (): string => {
        return `Hash: ${this.hashCode()}\nAssetID: ${this._assetID}\nArea: ${this._area}\nLocation: ${this.location}`;
    }
}