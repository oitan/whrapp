/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * src/sdk/LICENSE file in the root directory of this source tree.
 */
import process from "node:process";
import { PartialWAConfigType, WAConfigType } from "./types/config.ts";
import { WhatsAppClass } from "./types/WhatsApp.ts";
import * as SDKEnums from "./types/enums.ts";
import { semanticVersionString } from "./types/version.ts";
import { importConfig } from "./utils.ts";
import { SDKVersion } from "./version.ts";
import Logger from "./logger.ts";
import Requester from "./requester.ts";
import MessagesAPI from "./api/messages.ts";
import PhoneNumbersAPI from "./api/phoneNumbers.ts";
import TwoStepVerificationAPI from "./api/twoStepVerification.ts";
import WebhooksAPI from "./api/webhooks.ts";

const LIB_NAME = "WHATSAPP";
const LOG_LOCAL = false;
const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === "true" || LOG_LOCAL);

const headerPrefix = "WA_SDK";

export default class WhatsApp implements WhatsAppClass {
    config: WAConfigType;
    sdkVersion: Readonly<semanticVersionString>;
    requester: Readonly<Requester>;

    readonly messages: MessagesAPI;
    readonly phoneNumbers: PhoneNumbersAPI;
    readonly twoStepVerification: TwoStepVerificationAPI;
    readonly webhooks: WebhooksAPI;
    static readonly Enums = SDKEnums;
    readonly runtimeEnvironment: "Node.js" | "Deno" | "";

    constructor(env?: PartialWAConfigType) {
        this.sdkVersion = SDKVersion;
        this.config = importConfig(env);
        this.requester = new Requester(
            this.config[SDKEnums.WAConfigEnum.BaseURL],
            this.config[SDKEnums.WAConfigEnum.APIVersion],
            this.config[SDKEnums.WAConfigEnum.PhoneNumberId],
            this.config[SDKEnums.WAConfigEnum.AccessToken],
            this.config[SDKEnums.WAConfigEnum.BusinessAcctId],
            this.userAgent(),
        );

        this.messages = new MessagesAPI(this.config, this.requester);
        this.phoneNumbers = new PhoneNumbersAPI(this.config, this.requester);
        this.twoStepVerification = new TwoStepVerificationAPI(
            this.config,
            this.requester,
        );
        this.webhooks = new WebhooksAPI(
            this.config,
            this.requester,
            this.userAgent(),
        );

        if (globalThis.Deno) {
            this.runtimeEnvironment = "Deno";
        } else if (
            globalThis.process && globalThis.process.versions &&
            globalThis.process.versions.node
        ) {
            this.runtimeEnvironment = "Node.js";
        } else {
            this.runtimeEnvironment = "";
        }

        LOGGER.log(`WhatsApp ${this.runtimeEnvironment} SDK instantiated!`);
    }

    version(): semanticVersionString {
        return this.sdkVersion;
    }

    private userAgent(): string {
        const userAgentString =
            `${headerPrefix}/${this.version()} (${this.runtimeEnvironment} ${process.version})`;
        return userAgentString;
    }

    updateTimeout(ms: number): boolean {
        this.config[SDKEnums.WAConfigEnum.RequestTimeout] = ms;
        LOGGER.log(`Updated request timeout to ${ms}ms`);
        return true;
    }

    updateSenderNumberId(phoneNumberId: number): boolean {
        this.config[SDKEnums.WAConfigEnum.PhoneNumberId] = phoneNumberId;
        LOGGER.log(`Updated sender phone number id to ${phoneNumberId}`);
        return true;
    }

    updateAccessToken(accessToken: string): boolean {
        this.config[SDKEnums.WAConfigEnum.AccessToken] = accessToken;
        LOGGER.log(`Updated access token`);
        return true;
    }
}
