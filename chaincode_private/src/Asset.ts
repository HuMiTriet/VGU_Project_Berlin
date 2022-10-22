import { Ownership } from '../../chaincode/resources/classOwnership'
import { RoomType } from '../../chaincode/resources/classRoomType'

import { Object, Property, Returns } from 'fabric-contract-api'
import { Md5 } from 'ts-md5';

@Object()
export class RealEstate {
    @Property()
    public static docType?: string

    @Property()
    private static assetID: string

    public static getAssetID(): string {
        return this.assetID
    }

    @Property()
    private static area: number

    public static getArea(): number {
        return this.area
    }

    @Property()
    public static location: string

    public static getLocation(): string {
        return this.location
    }

    @Property()
    public static owner: string

    public static getOwner(): string {
        return this.owner;
    }

    public static setOwner(owner: string): void {
        this.owner = owner
    }

    @Property()
    public static appraisedValues: number

    public static getAppraisedValues(): number {
        return this.appraisedValues
    }

    public static RealEstate(assetID: string,
        area: number, location: string,
        owner: string, appraisedValues: number) {
        this.assetID = assetID;
        this.area = area;
        this.owner = owner;
        this.location = location;
        this.appraisedValues = appraisedValues;
    }

    public static hashCode(): string {
        let md5 = new Md5();
        md5.appendStr(this.assetID)
            .appendStr(<any>this.area)
            .appendStr(this.location)
        return <string>md5.end()
    }

    public static toString = (): string => {
        return `Hash: ${RealEstate.hashCode()}\nAssetID: ${RealEstate.assetID}\nArea: ${RealEstate.area}\nLocation: ${RealEstate.location}`;
    }
}