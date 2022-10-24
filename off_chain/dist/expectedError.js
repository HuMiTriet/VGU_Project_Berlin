"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpectedError = void 0;
class ExpectedError extends Error {
    constructor(message) {
        super(message);
        this.name = ExpectedError.name;
    }
}
exports.ExpectedError = ExpectedError;
//# sourceMappingURL=expectedError.js.map