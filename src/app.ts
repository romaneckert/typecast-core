import { IApp } from "./iapp";
import { Server } from "./service/server";
import { Logger } from "./service/logger";
import { User } from "./controller/user";

export class Application implements IApp {

    controller: {
        user: User
    }

    service: {
        logger: Logger
        server: Server
    }

    constructor() {

        let logger = new Logger();

        this.service = {
            logger: logger,
            server: new Server(logger)
        }

        this.controller = {
            user: new User(logger)
        }
    }

    boot() {
        console.log('...booting');
    }
}
