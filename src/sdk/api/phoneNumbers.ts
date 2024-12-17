/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * src/sdk/LICENSE file in the root directory of this source tree.
 */
import process from "node:process";
import { RequesterResponseInterface } from "../types/requester.ts";
import BaseAPI from "./base.ts";
import { HttpMethodsEnum, WAConfigEnum } from "../types/enums.ts";
import * as pn from "../types/phoneNumbers.ts";
import Logger from "../logger.ts";

const LIB_NAME = "PHONENUMBERS_API";
const LOG_LOCAL = false;
const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === "true" || LOG_LOCAL);

export default class PhoneNumbersAPI extends BaseAPI
    implements pn.phoneNumbersClass {
    private readonly commonMethod = HttpMethodsEnum.Post;

    requestCode(
        body: pn.RequestCodeObject,
    ): Promise<RequesterResponseInterface<pn.PhoneNumbersResponseObject>> {
        const endpoint = "request_code";
        LOGGER.log(
            `Requesting phone number verification code for phone number Id ${
                this.config[WAConfigEnum.PhoneNumberId]
            }`,
        );

        return this.client.sendCAPIRequest(
            this.commonMethod,
            endpoint,
            this.config[WAConfigEnum.RequestTimeout],
            JSON.stringify(body),
        );
    }

    verifyCode(
        body: pn.VerifyCodeObject,
    ): Promise<RequesterResponseInterface<pn.PhoneNumbersResponseObject>> {
        const endpoint = "verify_code";
        LOGGER.log(
            `Sending phone number verification code ${body.code} for phone number Id ${
                this.config[WAConfigEnum.PhoneNumberId]
            }`,
        );

        return this.client.sendCAPIRequest(
            this.commonMethod,
            endpoint,
            this.config[WAConfigEnum.RequestTimeout],
            JSON.stringify(body),
        );
    }
}
