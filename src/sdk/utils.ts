/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * src/sdk/LICENSE file in the root directory of this source tree.
 */
import process from "node:process";
import * as crypto from "node:crypto";
import { PartialWAConfigType, WAConfigType } from "./types/config.ts";
import { WAConfigEnum, WARequiredConfigEnum } from "./types/enums.ts";
import Logger from "./logger.ts";

const LIB_NAME = "UTILS";
const LOG_LOCAL = false;
const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === "true" || LOG_LOCAL);

const DEFAULT_BASE_URL = "graph.facebook.com";
const DEFAULT_LISTENER_PORT = 3000;
const DEFAULT_MAX_RETRIES_AFTER_WAIT = 30;
const DEFAULT_REQUEST_TIMEOUT = 20000;

const emptyEnvChecker = (
    env?: PartialWAConfigType,
) => {
    for (const value of Object.values(WARequiredConfigEnum)) {
        LOGGER.log(value + " ---- " + process.env[value]);
        if (
            (process.env[value] === undefined ||
                process.env[value] === "") &&
            (env?.[value] === undefined || env?.[value] === "")
        ) {
            LOGGER.log(
                `Environmental variable and/or argument: ${value} is undefined`,
            );
            throw new Error("Invalid configuration.");
        }
    }
};

export const importConfig = (
    env?: PartialWAConfigType,
) => {
    emptyEnvChecker(env);

    const config: WAConfigType = {
        [WAConfigEnum.BaseURL]: env?.WA_BASE_URL || process.env.WA_BASE_URL ||
            DEFAULT_BASE_URL,
        [WAConfigEnum.AppId]: env?.M4D_APP_ID || process.env.M4D_APP_ID || "",
        [WAConfigEnum.AppSecret]: env?.M4D_APP_SECRET ||
            process.env.M4D_APP_SECRET || "",
        [WAConfigEnum.PhoneNumberId]: env?.WA_PHONE_NUMBER_ID ||
            parseInt(process.env.WA_PHONE_NUMBER_ID || ""),
        [WAConfigEnum.BusinessAcctId]: env?.WA_BUSINESS_ACCOUNT_ID ||
            process.env.WA_BUSINESS_ACCOUNT_ID || "",
        [WAConfigEnum.APIVersion]: env?.CLOUD_API_VERSION ||
            process.env.CLOUD_API_VERSION || "",
        [WAConfigEnum.AccessToken]: env?.CLOUD_API_ACCESS_TOKEN ||
            process.env.CLOUD_API_ACCESS_TOKEN || "",
        [WAConfigEnum.WebhookEndpoint]: env?.WEBHOOK_ENDPOINT ||
            process.env.WEBHOOK_ENDPOINT || "",
        [WAConfigEnum.WebhookVerificationToken]:
            env?.WEBHOOK_VERIFICATION_TOKEN ||
            process.env.WEBHOOK_VERIFICATION_TOKEN || "",
        [WAConfigEnum.ListenerPort]: env?.LISTENER_PORT ||
            parseInt(process.env.LISTENER_PORT || "") || DEFAULT_LISTENER_PORT,
        [WAConfigEnum.MaxRetriesAfterWait]: env?.MAX_RETRIES_AFTER_WAIT ||
            parseInt(process.env.MAX_RETRIES_AFTER_WAIT || "") ||
            DEFAULT_MAX_RETRIES_AFTER_WAIT,
        [WAConfigEnum.RequestTimeout]: env?.REQUEST_TIMEOUT ||
            parseInt(process.env.REQUEST_TIMEOUT || "") ||
            DEFAULT_REQUEST_TIMEOUT,
        [WAConfigEnum.Debug]: env?.DEBUG || process.env.DEBUG === "true",
    };

    LOGGER.log(`Configuration loaded for App Id ${config[WAConfigEnum.AppId]}`);

    return config;
};

export const generateXHub256Sig = (body: string, appSecret: string) => {
    return crypto
        .createHmac("sha256", appSecret)
        .update(body, "utf-8")
        .digest("hex");
};
