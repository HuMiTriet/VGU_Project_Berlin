import { Ownership } from '../../chaincode/resources/classOwnership'
import { RoomType } from '../../chaincode/resources/classRoomType'

import { Object, Property } from 'fabric-contract-api'
import { Md5 } from 'ts-md5';

@Object()
export class RealEstate {
    @Property()
    public docType?: string

    @Property()
    private assetID: string

    public getAssetID(): string {
        return this.assetID
    }

    @Property()
    private area: number

    public getArea(): number {
        return this.area
    }

    @Property()
    public location: string

    public getLocation(): string {
        return this.location
    }

    @Property()
    public owner: string
    public getOwner(): string {
        return this.owner;
    }

    @Property()
    public appraisedValues: number
    public getAppraisedValues(): number {
        return this.appraisedValues
    }

    public RealEstate(assetID: string,
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
        md5.appendStr(this.getAssetID()).appendStr(<any>this.getArea()).appendStr(this.getLocation())
        return <string>md5.end()
    }

    public toString = (): string => {
        return `Hash: ${this.hashCode()}\nAssetID: ${this.assetID}\nArea: ${this.area}\nLocation: ${this.location}`;
    }
}