// package org.hyperledger.fabric.samples.privatedata;

// import org.hyperledger.fabric.contract.annotation.DataType;
// import org.hyperledger.fabric.contract.annotation.Property;
// import org.hyperledger.fabric.shim.ChaincodeException;
// import org.json.JSONObject;

// import static java.nio.charset.StandardCharsets.UTF_8;

import { Object, Property } from 'fabric-contract-api'



// @DataType()
@Object()
// public final class TransferAgreement {
export class RealEstate {
    //     @Property()
    //     private final String assetID;
    @Property()
    private assetID: string;

    //     @Property()
    //     private String buyerID;
    @Property()
    private buyerID: string;

    //     public String getAssetID() {
    //         return assetID;
    //     }

    //     public String getBuyerID() {
    //         return buyerID;
    //     }

    //     public TransferAgreement(final String assetID,
    //                              final String buyer) {
    //         this.assetID = assetID;
    //         this.buyerID = buyer;
    //     }

    //     public byte[] serialize() {
    //         String jsonStr = new JSONObject(this).toString();
    //         return jsonStr.getBytes(UTF_8);
    //     }

    //     public static TransferAgreement deserialize(final byte[] assetJSON) {
    //         try {
    //             JSONObject json = new JSONObject(new String(assetJSON, UTF_8));
    //             final String id = json.getString("assetID");
    //             final String buyerID = json.getString("buyerID");
    //             return new TransferAgreement(id, buyerID);
    //         } catch (Exception e) {
    //             throw new ChaincodeException("Deserialize error: " + e.getMessage(), "DATA_ERROR");
    //         }
    //     }


    // }
}