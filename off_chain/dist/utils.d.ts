/**
 * Pick a random element from an array.
 * @param values Candidate elements.
 */
export declare function randomElement<T>(values: T[]): T;
/**
 * Generate a random integer in the range 0 to max - 1.
 * @param max Maximum value (exclusive).
 */
export declare function randomInt(max: number): number;
/**
 * Pick a random element from an array, excluding the current value.
 * @param values Candidate elements.
 * @param currentValue Value to avoid.
 */
export declare function differentElement<T>(values: T[], currentValue: T): T;
/**
 * Wait for all promises to complete, then throw an Error only if any of the promises were rejected.
 * @param promises Promises to be awaited.
 */
export declare function allFulfilled(promises: Promise<unknown>[]): Promise<void>;
/**
 * Return the value if it is defined; otherwise thrown an error.
 * @param value A value that might not be defined.
 * @param message Error message if the value is not defined.
 */
export declare function assertDefined<T>(value: T | null | undefined, message: string): T;
/**
 * Wrap a function call with a cache. On first call the wrapped function is invoked to obtain a result. Subsequent
 * calls return the cached result.
 * @param f A function whose result should be cached.
 */
export declare function cache<T>(f: () => T): () => T;
//# sourceMappingURL=utils.d.ts.map