import { ILogger } from '../interface/logger-interface';

export class LoggerService implements ILogger {

    public start() { }

    public log(message: string): boolean {
        console.log(message);
        return true;
    }
}