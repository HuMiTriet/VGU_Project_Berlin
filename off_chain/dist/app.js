"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("./connect");
const expectedError_1 = require("./expectedError");
const getAllAssets_1 = require("./getAllAssets");
const listen_1 = require("./listen");
const transact_1 = require("./transact");
const allCommands = {
    getAllAssets: getAllAssets_1.main,
    listen: listen_1.main,
    transact: transact_1.main,
};
async function main() {
    const commands = process.argv.slice(2).map(name => {
        const command = allCommands[name];
        if (!command) {
            printUsage();
            throw new Error(`Unknown command: ${name}`);
        }
        return command;
    });
    if (commands.length === 0) {
        printUsage();
        throw new Error('Missing command');
    }
    const client = await (0, connect_1.newGrpcConnection)();
    try {
        for (const command of commands) {
            await command(client);
        }
    }
    finally {
        client.close();
    }
}
function printUsage() {
    console.log('Arguments: <command1> [<command2> ...]');
    console.log('Available commands:', Object.keys(allCommands).join(', '));
}
main().catch(error => {
    if (error instanceof expectedError_1.ExpectedError) {
        console.log(error);
    }
    else {
        console.error('\nUnexpected application error:', error);
        process.exitCode = 1;
    }
});
//# sourceMappingURL=app.js.map