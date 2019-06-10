import { LoggerInterface } from '../interface/logger-interface';

export class LoggerService implements LoggerInterface {

    start() { }

    log(message: string): boolean {
        console.log(message);
        return true;
    }
}