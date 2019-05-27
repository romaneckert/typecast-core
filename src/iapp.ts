import { IService } from "./service/iservice";
import { ILogger } from "./service/ilogger";

export interface IApp {
    service: {
        logger: ILogger
        server: IService
    }
}  