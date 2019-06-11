import { ILogger } from "../interface/logger-interface";

export class UserController {

    protected logger: ILogger

    constructor(logger: ILogger) {
        this.logger = logger
    }

}