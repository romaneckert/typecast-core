import { ILogger } from './ilogger';

export class Logger implements ILogger {

    log(message: string): boolean {
        console.log(message);
        return true;
    }
}