import {
    Contract,
    Transaction,
    Context,
    Returns
} from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { RealEstate } from './Asset'
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

const utf8Decoder = new TextDecoder();
export class AssetTransfer extends Contract {
    static ASSET_COLLECTION_NAME: string = "assetCollection"
    static AGREEMENT_KEYPREFIX: string = "transferAgreement";

    @Transaction(false)
    @Returns('boolean')
    public async AssetExists(ctx: Context, id: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
    public async CreateAsset(ctx: Context, assetID: string, area: number, location: string, owner: string, appraisedValue: number): Promise<void> {
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
        if (appraisedValue <= 0) {
            doFail("Empty input: appraisedValue");
        }

        const asset = {
            assetID: assetID,
            area: area,
            location: location,
            owner: owner,
            appraisedValue: appraisedValue,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(assetID, Buffer.from(stringify(sortKeysRecursive(asset))));

        let clientID = ctx.getClientIdentity().getId();
    }
}