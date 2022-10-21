import { Ownership } from '../../chaincode/resources/classOwnership'
import { RoomType } from '../../chaincode/resources/classRoomType'

import { Object, Property } from 'fabric-contract-api'
import { Md5 } from 'ts-md5';

@Object()
export class RealEstate {

    @Property()
    private assetID: string

    public getAssetID(): string {
        return this.assetID
    }

    @Property()
    public roomList: RoomType

    // @Property()
    // private final String objectType;

    // @Property()
    // private final String color;

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

    // public String getAssetID() {
    //     return assetID;
    // }


    // public String getColor() {
    //     return color;
    // }


    // public int getSize() {
    //     return size;
    // }

    // public String getOwner() {
    //     return owner;
    // }

    @Property()
    public owners: Ownership[]

    // public String getObjectType() {
    //     return objectType;
    // }

    // public void setOwner(final String newowner) {
    //     owner = newowner;
    // }

    // public Asset(final String type,
    //     final String assetID, final String color,
    //     final int size, final String owner) {
    //     this.objectType = type;
    //     this.assetID = assetID;
    //     this.color = color;
    //     this.size = size;
    //     this.owner = owner;
    // }

    // public byte[] serialize() {
    //     String jsonStr = new JSONObject(this).toString();
    //     return jsonStr.getBytes(UTF_8);
    // }

    // public static Asset deserialize(final byte[] assetJSON) {
    //     return deserialize(new String(assetJSON, UTF_8));
    // }

    // public static Asset deserialize(final String assetJSON) {
    //     try {
    //         JSONObject json = new JSONObject(assetJSON);
    //         final String id = json.getString("assetID");
    //         final String type = json.getString("objectType");
    //         final String color = json.getString("color");
    //         final String owner = json.getString("owner");
    //         final int size = json.getInt("size");
    //         return new Asset(type, id, color, size, owner);
    //     } catch (Exception e) {
    //         throw new ChaincodeException("Deserialize error: " + e.getMessage(), "DATA_ERROR");
    //     }
    // }

    // @Override
    // public boolean equals(final Object obj) {
    //     if (this == obj) {
    //         return true;
    //     }

    //     if ((obj == null) || (getClass() != obj.getClass())) {
    //         return false;
    //     }

    //     Asset other = (Asset) obj;

    //     return Objects.deepEquals(
    //         new String[]{ getAssetID(), getColor(), getOwner() },
    //         new String[]{ other.getAssetID(), other.getColor(), other.getOwner() })
    //         &&
    //         Objects.deepEquals(
    //             new int[]{ getSize() },
    //             new int[]{ other.getSize() });
    // }

    // @Override
    // public int hashCode() {
    //     return Objects.hash(getObjectType(), getAssetID(), getColor(), getSize(), getOwner());
    // }
    public hashCode(): string {
        let md5 = new Md5();

        // Append incrementally your file or other input
        // Methods are chainable
        md5.appendStr(this.getAssetID()).appendStr(<any>this.getArea()).appendStr(this.getLocation())

        // Generate the MD5 hex string

        return <string>md5.end()
        // return Objects.hash(getObjectType(), getAssetID(), getColor(), getSize(), getOwner());
    }

    // @Override
    // public String toString() {
    //     return this.getClass().getSimpleName() + "@" + Integer.toHexString(hashCode())
    //         + " [assetID=" + assetID + ", type=" + objectType + ", color="
    //         + color + ", size=" + size + ", owner=" + owner + "]";
    // }
    public toString = (): string => {
        return `Hash: ${this.hashCode()}\nAssetID: ${this.assetID}\nArea: ${this.area}\nLocation: ${this.location}`;
    }


}