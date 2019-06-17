import { Connection, Repository } from 'typeorm';
import { Log } from '../entity/log';
import { ILogger } from '../interface/logger-interface';

export class LoggerService implements ILogger {
    public type: string;
    public name: string;

    public logRepository: Repository<Log>;

    private maxSizePerLogFile: number = 16 * 1024 * 1024;
    private maxLogRotationsPerType: number = 10;
    private maxHistoryLength: number = 1000;
    private duplicateTime: number = 10000;

    public constructor(type: string, name: string) {
        this.type = type;
        this.name = name;
    }

    public set databaseConnection(connection: Connection) {
        this.logRepository = connection.getRepository(Log);
    }

    public start() {
        // TODO: check and create directories
    }

    public stop() {
        // nothing to do
    }

    public async emergency(message: string, meta: any): Promise<void> {
        await this.log(0, message, meta);
    }

    public async alert(message: string, data?: any): Promise<void> {
        await this.log(1, message, data);
    }

    public async critical(message: string, data?: any): Promise<void> {
        await this.log(2, message, data);
    }

    public async error(message: string, data?: any): Promise<void> {
        await this.log(3, message, data);
    }

    public async warning(message: string, data?: any): Promise<void> {
        await this.log(4, message, data);
    }

    public async notice(message: string, data?: any): Promise<void> {
        await this.log(5, message, data);
    }

    public async info(message: string, data?: any): Promise<void> {
        await this.log(6, message, data);
    }

    public async debug(message: string, data?: any): Promise<void> {
        await this.log(7, message, data);
    }

    private async log(code: number, message: string, data?: any): Promise<void> {
        const date = new Date();

        // trim message
        message = message.trim();

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        const log = new Log();
        log.code = code;
        log.message = message;

        if (undefined !== this.logRepository) {
            try {
                await this.logRepository.save(log);
            } catch (err) {
                // TODO: handle error
            }
        }
    }
}
