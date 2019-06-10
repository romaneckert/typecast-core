import { ApplicationInterface } from "./interface/application-interface";
import { ServerService } from "./service/server-service";
import { LoggerService } from "./service/logger-service";
import { UserController } from "./controller/user-controller";
import { FileSystem } from "./util/fs";

export class Application implements ApplicationInterface {

    controller: {
        user: UserController
    }

    service: {
        logger: LoggerService
        server: ServerService
    }

    util: {
        fs: FileSystem
    }

    constructor() {

        let logger = new LoggerService();

        this.service = {
            logger: logger,
            server: new ServerService(logger)
        }

        this.controller = {
            user: new UserController(logger)
        }

        this.util = {
            fs: new FileSystem()
        }
    }

    boot() {
        console.log('...booting');

        for (let service of Object.values(this.service)) {
            service.start();
        }
    }
}
