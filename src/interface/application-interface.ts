import { ServiceInterface } from "./service-interface";
import { LoggerInterface } from "./logger-interface";

export interface ApplicationInterface {
    service: {
        logger: LoggerInterface
        server: ServiceInterface
    }
}  