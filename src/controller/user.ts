import { ILogger } from "../service/ilogger";

export class User {

    logger: ILogger

    constructor(logger: ILogger) {
        this.logger = logger
    }
    
}