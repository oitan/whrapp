/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * src/sdk/LICENSE file in the root directory of this source tree.
 */
import { RequesterClass } from "./requester.ts";
import { WAConfigType } from "./config.ts";

export declare class BaseClass {
    constructor(config: WAConfigType, HttpsClient?: RequesterClass);
}
