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
import {
    ComponentTypesEnum,
    HttpMethodsEnum,
    MessageTypesEnum,
    WAConfigEnum,
} from "../types/enums.ts";
import { RequestData } from "../types/httpsClient.ts";
import * as m from "../types/messages.ts";
import Logger from "../logger.ts";

const LIB_NAME = "MESSAGES_API";
const LOG_LOCAL = false;
const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === "true" || LOG_LOCAL);

export default class MessagesAPI extends BaseAPI implements m.MessagesClass {
    private readonly commonMethod = HttpMethodsEnum.Post;
    private readonly commonEndpoint = "messages";

    bodyBuilder<T extends MessageTypesEnum, C extends ComponentTypesEnum>(
        type: T,
        payload:
            | m.AudioMediaObject
            | [m.ContactObject]
            | m.DocumentMediaObject
            | m.ImageMediaObject
            | m.InteractiveObject
            | m.LocationObject
            | m.MessageTemplateObject<C>
            | m.StickerMediaObject
            | m.TextObject
            | m.VideoMediaObject,
        toNumber: string,
        replyMessageId?: string,
    ) {
        const body: m.MessageRequestBody<T> = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: toNumber,
            type: type,
            [type]: payload,
        };

        if (replyMessageId) body["context"] = { message_id: replyMessageId };

        return body;
    }

    send(
        body: RequestData,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        return this.client.sendCAPIRequest(
            this.commonMethod,
            this.commonEndpoint,
            this.config[WAConfigEnum.RequestTimeout],
            body,
        );
    }

    audio(
        body: m.AudioMediaObject,
        recipient: number,
        replyMessageId?: string,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        return this.send(
            JSON.stringify(
                this.bodyBuilder(
                    MessageTypesEnum.Audio,
                    body,
                    recipient.toString(),
                    replyMessageId,
                ),
            ),
        );
    }

    contacts(
        body: [m.ContactObject],
        recipient: number,
        replyMessageId?: string,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        return this.send(
            JSON.stringify(
                this.bodyBuilder(
                    MessageTypesEnum.Contacts,
                    body,
                    recipient.toString(),
                    replyMessageId,
                ),
            ),
        );
    }

    document(
        body: m.DocumentMediaObject,
        recipient: number,
        replyMessageId?: string,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        return this.send(
            JSON.stringify(
                this.bodyBuilder(
                    MessageTypesEnum.Document,
                    body,
                    recipient.toString(),
                    replyMessageId,
                ),
            ),
        );
    }

    image(
        body: m.ImageMediaObject,
        recipient: number,
        replyMessageId?: string,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        return this.send(
            JSON.stringify(
                this.bodyBuilder(
                    MessageTypesEnum.Image,
                    body,
                    recipient.toString(),
                    replyMessageId,
                ),
            ),
        );
    }

    interactive(
        body: m.InteractiveObject,
        recipient: number,
        replyMessageId?: string,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        return this.send(
            JSON.stringify(
                this.bodyBuilder(
                    MessageTypesEnum.Interactive,
                    body,
                    recipient.toString(),
                    replyMessageId,
                ),
            ),
        );
    }

    location(
        body: m.LocationObject,
        recipient: number,
        replyMessageId?: string,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        return this.send(
            JSON.stringify(
                this.bodyBuilder(
                    MessageTypesEnum.Location,
                    body,
                    recipient.toString(),
                    replyMessageId,
                ),
            ),
        );
    }

    sticker(
        body: m.StickerMediaObject,
        recipient: number,
        replyMessageId?: string,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        return this.send(
            JSON.stringify(
                this.bodyBuilder(
                    MessageTypesEnum.Sticker,
                    body,
                    recipient.toString(),
                    replyMessageId,
                ),
            ),
        );
    }

    template(
        body: m.MessageTemplateObject<ComponentTypesEnum>,
        recipient: number,
        replyMessageId?: string,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        return this.send(
            JSON.stringify(
                this.bodyBuilder(
                    MessageTypesEnum.Template,
                    body,
                    recipient.toString(),
                    replyMessageId,
                ),
            ),
        );
    }

    text(
        body: m.TextObject,
        recipient: number,
        replyMessageId?: string,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        LOGGER.log(body);
        return this.send(
            JSON.stringify(
                this.bodyBuilder(
                    MessageTypesEnum.Text,
                    body,
                    recipient.toString(),
                    replyMessageId,
                ),
            ),
        );
    }

    video(
        body: m.VideoMediaObject,
        recipient: number,
        replyMessageId?: string,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        return this.send(
            JSON.stringify(
                this.bodyBuilder(
                    MessageTypesEnum.Video,
                    body,
                    recipient.toString(),
                    replyMessageId,
                ),
            ),
        );
    }

    status(
        body: m.StatusObject,
    ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
        const mp: m.GeneralMessageBody = { messaging_product: "whatsapp" };
        const bodyToSend: m.StatusRequestBody = Object.assign(mp, body);

        return this.send(JSON.stringify(bodyToSend));
    }
}
