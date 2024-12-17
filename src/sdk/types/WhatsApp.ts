/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * src/sdk/LICENSE file in the root directory of this source tree.
 */
import { semanticVersionString } from "./version.ts";

export declare class WhatsAppClass {
    constructor(senderNumberId?: number);
    version: () => semanticVersionString;
    updateTimeout(ms: number): boolean;
    updateSenderNumberId(phoneNumberId: number): boolean;
    updateAccessToken(accessToken: string): boolean;
}
