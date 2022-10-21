const RED = '\x1b[31m\n';
const RESET = '\x1b[0m';
export function doFail(msgString: string): never {
    console.error(`${RED}\t${msgString}${RESET}`);
    throw new Error(msgString);
}

doFail("yes")