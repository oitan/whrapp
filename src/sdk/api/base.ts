/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * src/sdk/LICENSE file in the root directory of this source tree.
 */
import process from "node:process";
import { BaseClass } from "../types/base.ts";
import { RequesterClass } from "../types/requester.ts";
import { WAConfigType } from "../types/config.ts";
import Logger from "../logger.ts";

const LIB_NAME = "BaseAPI";
const LOG_LOCAL = false;
const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === "true" || LOG_LOCAL);

export default class BaseAPI implements BaseClass {
    protected client: RequesterClass;
    protected config: WAConfigType;

    constructor(config: WAConfigType, HttpsClient: RequesterClass) {
        this.client = HttpsClient;
        this.config = config;

        LOGGER.log(`Initialized with HTTPSClient`);
    }
}
