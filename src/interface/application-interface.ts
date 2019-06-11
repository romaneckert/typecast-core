import { ILogger } from "./logger-interface";
import { IService } from "./service-interface";

export interface IApplication {
    service: {
        logger: ILogger
        server: IService
    }
}  