import { Ownership } from '../../chaincode/resources/classOwnership'
import { RoomType } from '../../chaincode/resources/classRoomType'

import { Object, Property, Returns } from 'fabric-contract-api'
import { Md5 } from 'ts-md5';

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

    public serialize(): Uint8Array {
        let jsonStr: string = JSON.stringify(this);
        return new TextEncoder().encode(jsonStr);
    }

    public static deserialize(assetJSON: Uint8Array): RealEstate {
        return JSON.parse(Buffer.from(assetJSON).toString('utf8'));
    }
    public toString = (): string => {
        return `Hash: ${this.hashCode()}\nAssetID: ${this._assetID}\nArea: ${this._area}\nLocation: ${this.location}`;
    }
}