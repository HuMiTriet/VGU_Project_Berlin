import { Md5 } from 'ts-md5';

let md5 = new Md5();

// Append incrementally your file or other input
// Methods are chainable
md5.appendStr('somestring')
    .appendAsciiStr('a different string');

// Generate the MD5 hex string
md5.end()
console.log(typeof md5.end() + `\n neko`)