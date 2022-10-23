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
        const exists = await this.AssetExists(ctx, assetID);
        if (exists) {
            throw new Error(`The asset ${assetID} already exists`);
        }
        //input validations
        if (assetID == "") {
            doFail("Empty input: assetID");
        }
        if (area <= 0) {
            doFail("Empty input: area");
        }
        if (location == "") {
            doFail("Empty input: location");
        }
        if (owner == "") {
            doFail("Empty input: owner");
        }

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
            doFail(`AgreetoTransfer call must specify \"asset_value\" in Transient map input`)
        }

        let transientAssetJSON: Uint8Array = transientMap.get("asset_value")

        let assetID: string
        let assetPriv: AssetPrivateDetails
        try {
            let json: JSON = JSON.parse(Buffer.from(transientAssetJSON).toString('utf8'))
            assetID = json["assetID"].toString()
            assetPriv = new AssetPrivateDetails(assetID, <number>json["appraisedValue"])
        }
        catch (Error) {
            doFail(`TransientMap deserialized error: ${Error}`);
        }

        if (assetID == "") {
            doFail("Invalid input in Transient map: assetID");
        }

        if (assetPriv.appraisedValue < 0) {
            doFail("Input must be positive integer: appraisedValue");
        }

        console.log(`AgreeToTransfer: verify asset ${assetID} exists\n`)

        let existing: RealEstate = await this.ReadAsset(ctx, assetID);
        if (existing == null) {
            doFail(`Asset does not exist in the collection: ${assetID}`)
        }

        // Get collection name for this organization.
        let orgCollectionName: string = AssetTransfer.getCollectionName(ctx);

        AssetTransfer.verifyClientOrgMatchesPeerOrg(ctx);

        //Save AssetPrivateDetails to org collection
        console.log(`Put AssetPrivateDetails: collection ${orgCollectionName}, ID ${assetID}\n`);
        ctx.stub.putPrivateData(orgCollectionName, assetID, assetPriv.serialize());

        let clientID: string = ctx.clientIdentity.getID();
        //Write the AgreeToTransfer key in assetCollection
        let aggKey: string = ctx.stub.createCompositeKey(AssetTransfer.AGREEMENT_KEYPREFIX, [assetID]);
        console.log(`AgreeToTransfer Put: collection ${AssetTransfer.ASSET_COLLECTION_NAME}, ID ${assetID}, Key ${aggKey}\n`);
        ctx.stub.putPrivateData(AssetTransfer.ASSET_COLLECTION_NAME, aggKey.toString(), new TextEncoder().encode(clientID));
    }
}