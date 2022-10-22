import { Ownership } from '../../chaincode/resources/classOwnership'
import { RoomType } from '../../chaincode/resources/classRoomType'

import { Object, Property, Returns } from 'fabric-contract-api'
import { Md5 } from 'ts-md5';

@Object()
export class RealEstate {
    @Property()
    public docType?: string

    @Property()
    private assetID: string

    @Property()
    private area: number

    @Property()
    public location: string

    @Property()
    public owner: string

    @Property()
    public appraisedValues: number

    constructor(assetID: string,
        area: number, location: string,
        owner: string, appraisedValues: number) {
        this.assetID = assetID;
        this.area = area;
        this.owner = owner;
        this.location = location;
        this.appraisedValues = appraisedValues;
    }

    public hashCode(): string {
        let md5 = new Md5();
        md5.appendStr(this.assetID)
            .appendStr(<any>this.area)
            .appendStr(this.location)
        return <string>md5.end()
    }

    public toString = (): string => {
        return `Hash: ${this.hashCode()}\nAssetID: ${this.assetID}\nArea: ${this.area}\nLocation: ${this.location}`;
    }
}