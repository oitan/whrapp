/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * src/sdk/LICENSE file in the root directory of this source tree.
 */
import {
    createServer,
    IncomingMessage,
    Server,
    ServerResponse,
} from "node:http";
import { Socket } from "node:net";
import * as h from "./types/httpsServer.ts";

export default class Httpserver implements h.HttpserverClass {
    sockets: Set<Socket>;
    server: Server;
    listening = false;

    constructor(
        port: number,
        cb: (req: IncomingMessage, res: ServerResponse) => any,
    ) {
        this.sockets = new Set();
        this.server = createServer(cb).listen(port);

        this.server.on("connection", (socket: Socket) => {
            this.sockets.add(socket);
            this.listening = true;

            this.server.once("close", () => {
                this.sockets.delete(socket);
                this.listening = false;
            });
        });
    }

    public isListening() {
        return this.listening;
    }

    public close(cb?: (err?: Error) => any) {
        for (const socket of this.sockets) {
            socket.destroy();
            this.sockets.delete(socket);
        }

        this.server.close(cb);
    }
}
