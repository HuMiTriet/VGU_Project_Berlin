import * as grpc from "@grpc/grpc-js";
import { ConnectOptions } from "@hyperledger/fabric-gateway";
export declare const channelName: string;
export declare const chaincodeName: string;
export declare function newGrpcConnection(): Promise<grpc.Client>;
export declare function newConnectOptions(client: grpc.Client): Promise<ConnectOptions>;
//# sourceMappingURL=connect.d.ts.map