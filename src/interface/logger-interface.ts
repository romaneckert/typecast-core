import { ServiceInterface } from "./service-interface";

export interface LoggerInterface extends ServiceInterface {
    log(message: string): boolean;
}  