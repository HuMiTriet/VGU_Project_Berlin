import {
    Contract,
    Transaction,
    Context,
    Returns
} from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { RealEstate } from './Asset'
import { AssetPrivateDetails } from './AssetPrivateDetails'
import { TransferAgreement } from './TransferAgreement';

enum AssetTransferErrors {
    INCOMPLETE_INPUT,
    INVALID_ACCESS,
    ASSET_NOT_FOUND,
    ASSET_ALREADY_EXISTS
}

const RED = '\x1b[31m\n';
const RESET = '\x1b[0m';
export function doFail(msgString: string): never {
    console.error(`${RED}\t${msgString}${RESET}`);
    throw new Error(msgString);
}

function aligned16(a: Uint8Array) {
    return (a.byteOffset % 2 === 0) && (a.byteLength % 2 === 0);
}

function aligned32(a: Uint8Array) {
    return (a.byteOffset % 4 === 0) && (a.byteLength % 4 === 0);
}

function compare(a: string | any[] | Uint8Array | Uint16Array | Uint32Array, b: Uint8Array | Uint16Array | Uint32Array) {
    for (let i = a.length; -1 < i; i -= 1) {
        if ((a[i] !== b[i])) return false;
    }
    return true;
}

function equal8(a: Uint8Array, b: Uint8Array) {
    const ua = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    const ub = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
    return compare(ua, ub);
}
function equal16(a: Uint8Array, b: Uint8Array) {
    const ua = new Uint16Array(a.buffer, a.byteOffset, a.byteLength / 2);
    const ub = new Uint16Array(b.buffer, b.byteOffset, b.byteLength / 2);
    return compare(ua, ub);
}
function equal32(a: Uint8Array, b: Uint8Array) {
    const ua = new Uint32Array(a.buffer, a.byteOffset, a.byteLength / 4);
    const ub = new Uint32Array(b.buffer, b.byteOffset, b.byteLength / 4);
    return compare(ua, ub);
}

function equal(a: Uint8Array, b: Uint8Array): boolean {
    if (a instanceof ArrayBuffer) a = new Uint8Array(a, 0);
    if (b instanceof ArrayBuffer) b = new Uint8Array(b, 0);
    if (a.byteLength != b.byteLength) return false;
    if (aligned32(a) && aligned32(b))
        return equal32(a, b);
    if (aligned16(a) && aligned16(b))
        return equal16(a, b);
    return equal8(a, b);
}

// const utf8Decoder = new TextDecoder();
export class AssetTransfer extends Contract {
    static ASSET_COLLECTION_NAME: string = "assetCollection"
    static AGREEMENT_KEYPREFIX: string = "transferAgreement";

    private static verifyClientOrgMatchesPeerOrg(ctx: Context): void {
        let clientMSPID: string = ctx.clientIdentity.getMSPID();
        let peerMSPID: string = ctx.stub.getMspID();

        if (peerMSPID != clientMSPID) {
            doFail(`Client from org ${clientMSPID} is not authorized to read or write private data from an org ${peerMSPID} peer`);
        }
    }

    private static getCollectionName(ctx: Context): string {
        // Get the MSP ID of submitting client identity
        let clientMSPID: string = ctx.clientIdentity.getMSPID();
        // Create the collection name
        return clientMSPID + "PrivateCollection";
    }

    @Transaction(false)
    @Returns('boolean')
    public async AssetExists(ctx: Context, id: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    /**
     * Retrieves the asset public details with the specified ID from the AssetCollection.
     *
     * @param ctx     the transaction context
     * @param assetID the ID of the asset
     * @return the asset found on the ledger if there was one
     */
    @Transaction()
    public async ReadAsset(ctx: Context, assetID: string): Promise<RealEstate> {
        console.log(`ReadAsset: collection ${AssetTransfer.ASSET_COLLECTION_NAME}, ID ${assetID}\n`);
        let assetJSON: Uint8Array = await ctx.stub.getPrivateData(AssetTransfer.ASSET_COLLECTION_NAME, assetID);

        if (assetJSON == null || assetJSON.length == 0) {
            console.log(`Asset not found: ID ${assetID}\n`);
            return null;
        }

        let asset: RealEstate = RealEstate.deserialize(assetJSON);
        return asset;
    }

    /**
     * Retrieves the asset's AssetPrivateDetails details with the specified ID from the Collection.
     *
     * @param ctx        the transaction context
     * @param collection the org's collection containing asset private details
     * @param assetID    the ID of the asset
     * @return the AssetPrivateDetails from the collection, if there was one
     */
    @Transaction()
    public async ReadAssetPrivateDetails(ctx: Context, collection: string, assetID: string): Promise<AssetPrivateDetails> {
        console.log(`ReadAssetPrivateDetails: collection %${collection}, ID ${assetID}\n`);
        let assetPrvJSON: Uint8Array = await ctx.stub.getPrivateData(collection, assetID);

        if (assetPrvJSON == null || assetPrvJSON.length == 0) {
            console.log(`AssetPrivateDetails ${assetID} does not exist in collection ${collection}`);
            return null;
        }

        let assetpd: AssetPrivateDetails = AssetPrivateDetails.deserialize(assetPrvJSON);
        return assetpd;
    }

    /**
     * ReadTransferAgreement gets the buyer's identity from the transfer agreement from collection
     *
     * @param ctx     the transaction context
     * @param assetID the ID of the asset
     * @return the AssetPrivateDetails from the collection, if there was one
     */
    @Transaction()
    public async ReadTransferAgreement(ctx: Context, assetID: string): Promise<TransferAgreement> {
        let aggKey: string = ctx.stub.createCompositeKey(AssetTransfer.AGREEMENT_KEYPREFIX, [assetID]);
        console.log(`ReadTransferAgreement Get: collection ${AssetTransfer.ASSET_COLLECTION_NAME}, ID ${assetID}, Key ${aggKey}\n`);
        let buyerIdentity: Uint8Array = await ctx.stub.getPrivateData(AssetTransfer.ASSET_COLLECTION_NAME, aggKey.toString());

        if (buyerIdentity == null || buyerIdentity.length == 0) {
            console.log(`BuyerIdentity for asset ${assetID} does not exist in TransferAgreement`);
            return null;
        }

        return new TransferAgreement(assetID, <string><unknown>buyerIdentity);
    }

    // /**
    //  * QueryAssetByOwner queries for assets based on assetType, owner.
    //  * This is an example of a parameterized query where the query logic is baked into the chaincode,
    //  * and accepting a single query parameter (owner).
    //  *
    //  * @param ctx       the transaction context
    //  * @param assetType type to query for
    //  * @param owner     asset owner to query for
    //  * @return the asset found on the ledger if there was one
    //  */
    // @Transaction()
    // public QueryAssetByOwner(ctx: Context, assetType: string, owner: string): Array<RealEstate> {
    //     let queryString: string = `{\"selector\":{\"objectType\":\"${assetType}\",\"owner\":\"${owner}\"}}`
    //     return this.getQueryResult(ctx, queryString);
    // }

    // /**
    //  * QueryAssets uses a query string to perform a query for assets.
    //  * Query string matching state database syntax is passed in and executed as is.
    //  * Supports ad hoc queries that can be defined at runtime by the client.
    //  *
    //  * @param ctx         the transaction context
    //  * @param queryString query string matching state database syntax
    //  * @return the asset found on the ledger if there was one
    //  */
    // public QueryAssets(ctx: Context, queryString: string): Array<RealEstate> {
    //     return this.getQueryResult(ctx, queryString);
    // }

    // private getQueryResult(ctx: Context, queryString: string): Array<RealEstate> {
    //     console.log(`QueryAssets: ${queryString}`)

    //     let queryResults: Array<RealEstate> = [];
    //     try {
    //         // result: QueryResultsIterator
    //     }
    //     catch (Error) {
    //         doFail(Error.message);
    //     }
    //     return
    // }

    /**
     * Creates a new asset on the ledger from asset properties passed in as transient map.
     * Asset owner will be inferred from the ClientId via stub api
     *
     * @param ctx the transaction context
     *            Transient map with asset_properties key with asset json as value
     * @return the created asset
     */
    public async CreateAsset(ctx: Context, assetID: string, area: number, location: string, owner: string, appraisedValue: number): Promise<RealEstate> {
        const exists = await this.AssetExists(ctx, assetID)
        if (exists) {
            doFail(`The asset ${assetID} already exists`)
        }
        //input validations
        if (assetID == "") { doFail("Empty input: assetID") }
        if (area <= 0) { doFail("Empty input: area") }
        if (location == "") { doFail("Empty input: location") }
        if (owner == "") { doFail("Empty input: owner"); }

        let asset: RealEstate = new RealEstate(assetID, area, location, owner, appraisedValue);

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(assetID, Buffer.from(stringify(sortKeysRecursive(asset))));

        // Get ID of submitting client identity
        let clientID: string = ctx.clientIdentity.getID()

        // Verify that the client is submitting request to peer in their organization
        // This is to ensure that a client from another org doesn't attempt to read or
        // write private data from this peer.
        AssetTransfer.verifyClientOrgMatchesPeerOrg(ctx)

        //Make submitting client the owner
        asset.owner = clientID
        console.log(`CreateAsset Put: collection ${AssetTransfer.ASSET_COLLECTION_NAME}, ID ${assetID}\n`);
        console.log(`Put: collection ${AssetTransfer.ASSET_COLLECTION_NAME}, ID ${asset.serialize()}\n`);
        ctx.stub.putPrivateData(AssetTransfer.ASSET_COLLECTION_NAME, assetID, asset.serialize());

        // Get collection name for this organization.
        let orgCollectionName: string = AssetTransfer.getCollectionName(ctx);

        //Save AssetPrivateDetails to org collection
        let assetPriv: AssetPrivateDetails = new AssetPrivateDetails(assetID, appraisedValue);
        console.log("Put AssetPrivateDetails: collection ${orgCollectionName}, ${assetID}\n");
        ctx.stub.putPrivateData(orgCollectionName, assetID, assetPriv.serialize());

        return asset;
    }

    /**
     * AgreeToTransfer is used by the potential buyer of the asset to agree to the
     * asset value. The agreed to appraisal value is stored in the buying orgs
     * org specifc collection, while the the buyer client ID is stored in the asset collection
     * using a composite key
     * Uses transient map with key asset_value
     *
     * @param ctx the transaction context
     */
    @Transaction()
    async AgreetoTransfer(ctx: Context): Promise<void> {
        let transientMap: Map<string, Uint8Array> = ctx.stub.getTransient()
        if (!transientMap.has("asset_value")) {
            doFail(`${AssetTransferErrors.INCOMPLETE_INPUT.toString()}\nAgreetoTransfer call must specify \"asset_value\" in Transient map input`)
        }

        let transientAssetJSON: Uint8Array = transientMap.get("asset_value")

        let assetID: string
        let assetPriv: AssetPrivateDetails
        try {
            let json: JSON = JSON.parse(Buffer.from(transientAssetJSON).toString('utf8'))
            assetID = json["_assetID"].toString()
            assetPriv = new AssetPrivateDetails(assetID, <number>json["appraisedValue"])
        }
        catch (Error) { doFail(`TransientMap deserialized error: ${Error}`) }

        if (assetID == "") { doFail("Invalid input in Transient map: assetID") }
        if (assetPriv.appraisedValue < 0) { doFail("Input must be positive integer: appraisedValue") }

        console.log(`AgreeToTransfer: verify asset ${assetID} exists\n`)

        let existing: RealEstate = await this.ReadAsset(ctx, assetID);
        if (existing == null) { doFail(`Asset does not exist in the collection: ${assetID}`) }

        // Get collection name for this organization.
        let orgCollectionName: string = AssetTransfer.getCollectionName(ctx)

        AssetTransfer.verifyClientOrgMatchesPeerOrg(ctx);

        //Save AssetPrivateDetails to org collection
        console.log(`Put AssetPrivateDetails: collection ${orgCollectionName}, ID ${assetID}\n`)
        ctx.stub.putPrivateData(orgCollectionName, assetID, assetPriv.serialize())

        let clientID: string = ctx.clientIdentity.getID()
        //Write the AgreeToTransfer key in assetCollection
        let aggKey: string = ctx.stub.createCompositeKey(AssetTransfer.AGREEMENT_KEYPREFIX, [assetID])
        console.log(`AgreeToTransfer Put: collection ${AssetTransfer.ASSET_COLLECTION_NAME}, ID ${assetID}, Key ${aggKey}\n`)
        ctx.stub.putPrivateData(AssetTransfer.ASSET_COLLECTION_NAME, aggKey.toString(), new TextEncoder().encode(clientID))
    }

    /**
     * TransferAsset transfers the asset to the new owner by setting a new owner ID based on
     * AgreeToTransfer data
     *
     * @param ctx the transaction context
     * @return none
     */
    @Transaction()
    public async TransferAsset(ctx: Context): Promise<void> {
        let transientMap: Map<string, Uint8Array> = ctx.stub.getTransient()

        if (!transientMap.has("asset_value")) {
            doFail(`${AssetTransferErrors.INCOMPLETE_INPUT.toString()}\nAgreetoTransfer call must specify \"asset_value\" in Transient map input`)
        }

        let transientAssetJSON: Uint8Array = transientMap.get("asset_owner")
        let assetID: string
        let buyerMSP: string

        try {
            let json: JSON = JSON.parse(Buffer.from(transientAssetJSON).toString('utf8'))
            assetID = json["assetID"].toString()
            buyerMSP = json["buyerMSP"].toString()

        } catch (err) { doFail(`${AssetTransferErrors.INCOMPLETE_INPUT.toString()}\nTransientMap deserialized error ${err}`) }

        if (assetID == "") { doFail(`${AssetTransferErrors.INCOMPLETE_INPUT.toString()}\nInvalid input in Transient map: assetID`) }
        if (buyerMSP == "") { doFail(`${AssetTransferErrors.INCOMPLETE_INPUT.toString()}\nInvalid input in Transient map: buyerMSP`) }

        console.log(`TransferAsset: verify asset ${assetID} exists\n`)
        let assetJSON: Uint8Array = await ctx.stub.getPrivateData(AssetTransfer.ASSET_COLLECTION_NAME, assetID);

        if (assetJSON == null || assetJSON.length == 0) {
            doFail(`${AssetTransferErrors.INCOMPLETE_INPUT.toString()}\nAsset ${assetID} does not exist in the collection`)
        }

        AssetTransfer.verifyClientOrgMatchesPeerOrg(ctx);
        let thisAsset: RealEstate = RealEstate.deserialize(assetJSON)
        // Verify transfer details and transfer owner
        this.verifyAgreement(ctx, assetID, thisAsset.owner, buyerMSP)

        let transferAgreement: TransferAgreement = await this.ReadTransferAgreement(ctx, assetID);
        if (transferAgreement == null) {
            doFail(`${AssetTransferErrors.INCOMPLETE_INPUT.toString()}\nTransferAgreement does not exist for asset: ${assetID}`)
        }

        // Transfer asset in private data collection to new owner
        let newOwner: string = transferAgreement.buyerID
        thisAsset.owner = newOwner

        //Save updated Asset to collection
        console.log(`Transfer Asset: collection ${AssetTransfer.ASSET_COLLECTION_NAME}, ID ${assetID} to owner ${newOwner}\n`);
        ctx.stub.putPrivateData(AssetTransfer.ASSET_COLLECTION_NAME, assetID, thisAsset.serialize());

        // delete the key from owners collection
        let ownersCollectionName: string = AssetTransfer.getCollectionName(ctx);
        ctx.stub.deletePrivateData(ownersCollectionName, assetID);

        //Delete the transfer agreement from the asset collection
        let aggKey: string = ctx.stub.createCompositeKey(AssetTransfer.AGREEMENT_KEYPREFIX, [assetID]);
        console.log(`AgreeToTransfer deleteKey: collection ${AssetTransfer.ASSET_COLLECTION_NAME}, ID ${assetID}, Key ${aggKey}\n`);
        ctx.stub.deletePrivateData(AssetTransfer.ASSET_COLLECTION_NAME, aggKey.toString());
    }

    /**
     * Deletes a asset & related details from the ledger.
     * Input in transient map: asset_delete
     *
     * @param ctx the transaction context
     */
    @Transaction()
    public async DeleteAsset(ctx: Context): Promise<void> {
        let transientMap: Map<string, Uint8Array> = ctx.stub.getTransient();
        if (!transientMap.has("asset_value")) {
            doFail(`AgreetoTransfer call must specify \"asset_value\" in Transient map input`)
        }
        if (!transientMap.has("asset_delete")) {
            doFail(`${AssetTransferErrors.INCOMPLETE_INPUT.toString()}\nDeleteAsset call must specify 'asset_delete' in Transient map input`);
        }

        let transientAssetJSON: Uint8Array = transientMap.get("asset_delete");
        let assetID: string;

        try {
            let json: JSON = JSON.parse(Buffer.from(transientAssetJSON).toString('utf8'))
            assetID = json["assetID"].toString()
        } catch (err) {
            doFail(`${AssetTransferErrors.INCOMPLETE_INPUT.toString()}\nTransientMap deserialized error: ${err}`);
        }

        console.log(`DeleteAsset: verify asset ${assetID} exists\n`)

        let assetJSON: Uint8Array = await ctx.stub.getPrivateData(AssetTransfer.ASSET_COLLECTION_NAME, assetID);

        if (assetJSON == null || assetJSON.length == 0) {
            doFail(`${AssetTransferErrors.ASSET_NOT_FOUND.toString()}\nAsset ${assetID} does not exist`)
        }
        let ownersCollectionName: string = AssetTransfer.getCollectionName(ctx);
        let apdJSON: Uint8Array = await ctx.stub.getPrivateData(ownersCollectionName, assetID);

        if (apdJSON == null || apdJSON.length == 0) {
            doFail(`${AssetTransferErrors.ASSET_NOT_FOUND.toString()}\nFailed to read asset from owner's Collection ${ownersCollectionName}`)
        }
        AssetTransfer.verifyClientOrgMatchesPeerOrg(ctx);

        // delete the key from asset collection
        console.log(`DeleteAsset: collection ${AssetTransfer.ASSET_COLLECTION_NAME}, ID ${assetID}\n`);
        ctx.stub.deletePrivateData(AssetTransfer.ASSET_COLLECTION_NAME, assetID);

        // Finally, delete private details of asset
        ctx.stub.deletePrivateData(ownersCollectionName, assetID);
    }

    // Used by TransferAsset to verify that the transfer is being initiated by the owner and that
    // the buyer has agreed to the same appraisal value as the owner
    private async verifyAgreement(ctx: Context, assetID: string, owner: string, buyerMSP: string): Promise<void> {
        let clienID: string = ctx.clientIdentity.getID();

        // Check 1: verify that the transfer is being initiatied by the owner
        if (!(clienID == owner)) {
            doFail(`Submitting client identity does not own the asset: ${AssetTransferErrors.INVALID_ACCESS.toString()}`);
        }

        // Check 2: verify that the buyer has agreed to the appraised value
        let collectionOwner: string = AssetTransfer.getCollectionName(ctx); // get owner collection from caller identity
        let collectionBuyer: string = buyerMSP + "PrivateCollection";

        // Get hash of owners agreed to value
        let ownerAppraisedValueHash: Uint8Array = await ctx.stub.getPrivateDataHash(collectionOwner, assetID);
        if (ownerAppraisedValueHash == null) {
            doFail(`Hash of appraised value for ${assetID} does not exist in collection ${collectionOwner}`);
        }

        // Get hash of buyers agreed to value
        let buyerAppraisedValueHash: Uint8Array = await ctx.stub.getPrivateDataHash(collectionBuyer, assetID);
        if (buyerAppraisedValueHash == null) {
            doFail(`Hash of appraised value for ${assetID} does not exist in collection ${collectionBuyer}. AgreeToTransfer must be called by the buyer first.`);
        }

        // Verify that the two hashes match
        if (!equal(ownerAppraisedValueHash, buyerAppraisedValueHash)) {
            doFail(`Hash for appraised value for owner ${ownerAppraisedValueHash} does not match value for seller ${buyerAppraisedValueHash}`);
        }
    }
}