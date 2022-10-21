import { Object, Property } from 'fabric-contract-api'

// @DataType()
@Object()
// class AssetPrivateDetails {
export class AssetPrivateDetails {
    //     @Property()
    //     private final String assetID;
    @Property()
    private assetID: string;

    //     @Property()
    //     private int appraisedValue;
    @Property()
    private appraisedValue: number

    //     public String getAssetID() {
    //         return assetID;
    //     }
    public getAssetID(): string {
        return this.assetID;
    }

    //     public int getAppraisedValue() {
    //         return appraisedValue;
    //     }
    public getAppraisedValue(): number {
        return this.appraisedValue;
    }

    //     public AssetPrivateDetails(final String assetID,
    //         final int appraisedValue) {
    //         this.assetID = assetID;
    //         this.appraisedValue = appraisedValue;
    //     }
    public AssetPrivateDetails(assetID: string, appraisedValue: number) {
        this.assetID = assetID;
        this.appraisedValue = appraisedValue;
    }

    //     public byte[] serialize() {
    //         String jsonStr = new JSONObject(this).toString();
    //         return jsonStr.getBytes(UTF_8);
    //     }

    //     public static AssetPrivateDetails deserialize(final byte[] assetJSON) {
    //         try {
    //             JSONObject json = new JSONObject(new String(assetJSON, UTF_8));
    //             final String id = json.getString("assetID");
    //             final int appraisedValue = json.getInt("appraisedValue");
    //             return new AssetPrivateDetails(id, appraisedValue);
    //         } catch (Exception e) {
    //             throw new ChaincodeException("Deserialize error: " + e.getMessage(), "DATA_ERROR");
    //         }
    //     }


    // }
}