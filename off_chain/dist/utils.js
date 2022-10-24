"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.assertDefined = exports.allFulfilled = exports.differentElement = exports.randomInt = exports.randomElement = void 0;
/**
 * Pick a random element from an array.
 * @param values Candidate elements.
 */
function randomElement(values) {
    return values[randomInt(values.length)];
}
exports.randomElement = randomElement;
/**
 * Generate a random integer in the range 0 to max - 1.
 * @param max Maximum value (exclusive).
 */
function randomInt(max) {
    return Math.floor(Math.random() * max);
}
exports.randomInt = randomInt;
/**
 * Pick a random element from an array, excluding the current value.
 * @param values Candidate elements.
 * @param currentValue Value to avoid.
 */
function differentElement(values, currentValue) {
    const candidateValues = values.filter(value => value !== currentValue);
    return randomElement(candidateValues);
}
exports.differentElement = differentElement;
/**
 * Wait for all promises to complete, then throw an Error only if any of the promises were rejected.
 * @param promises Promises to be awaited.
 */
async function allFulfilled(promises) {
    const results = await Promise.allSettled(promises);
    const failures = results
        .map(result => result.status === 'rejected' && result.reason)
        .filter(reason => !!reason);
    if (failures.length > 0) {
        const failMessages = ' - ' + failures.join('\n - ');
        throw new Error(`${failures.length} failures:\n${failMessages}\n`);
    }
}
exports.allFulfilled = allFulfilled;
/**
 * Return the value if it is defined; otherwise thrown an error.
 * @param value A value that might not be defined.
 * @param message Error message if the value is not defined.
 */
function assertDefined(value, message) {
    if (value == undefined) {
        throw new Error(message);
    }
    return value;
}
exports.assertDefined = assertDefined;
/**
 * Wrap a function call with a cache. On first call the wrapped function is invoked to obtain a result. Subsequent
 * calls return the cached result.
 * @param f A function whose result should be cached.
 */
function cache(f) {
    let value;
    return () => {
        if (value === undefined) {
            value = f();
        }
        return value;
    };
}
exports.cache = cache;
//# sourceMappingURL=utils.js.map