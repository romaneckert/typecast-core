import { LoggerInterface } from "../interface/logger-interface";

export class UserController {

    logger: LoggerInterface

    constructor(logger: LoggerInterface) {
        this.logger = logger
    }

}