import * as nodePath from 'path';
import { Repository } from 'typeorm';
import { ApplicationConfig } from '../config/application-config';
import { ContextConfig } from '../config/context-config';
import Container from '../core/container';
import { Service } from '../decorator/service';
import { Log } from '../entity/log';
import { FileSystemUtil } from '../util/file-system';
import { StringUtil } from '../util/string';
import { DatabaseService } from './database';

@Service()
export class LoggerService {
    public contextType: string = '';
    public contextName: string = '';

    private applicationConfig: ApplicationConfig;
    private contextConfig: ContextConfig;
    private logRepository: Repository<Log>;

    // TODO: add log rotation
    private maxSizePerLogFile: number = 16 * 1024 * 1024;
    private maxLogRotationsPerType: number = 10;
    private maxHistoryLength: number = 1000;
    private duplicateTime: number = 10000;

    constructor(applicationConfig: ApplicationConfig, contextConfig: ContextConfig) {
        this.applicationConfig = applicationConfig;
        this.contextConfig = contextConfig;
    }

    public async emergency(message: string, data?: any): Promise<void> {
        await this.log(0, message, data);
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

    public async removeAllLogFiles(): Promise<void> {
        await FileSystemUtil.remove(nodePath.join(process.cwd(), 'var', this.contextConfig.context, 'log'));
    }

    private async log(code: number, message: string, data?: any): Promise<void> {
        this.contextType = this.contextType.toLowerCase();

        if (0 === this.contextType.length) {
            this.contextType = 'undefined';
        }

        this.contextName = this.contextName.toLowerCase();

        if (0 === this.contextName.length) {
            this.contextName = 'undefined';
        }

        const date = new Date();

        // trim message
        message = message.trim();

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        // string type cast data
        if (undefined === data) {
            data = '';
        }

        data = StringUtil.cast(data);

        const log = new Log(code, date, this.contextType, this.contextName, message, data);

        await this.saveToDB(log);
        await this.writeLog(log);
        await this.writeToConsole(log);
    }

    private async saveToDB(log: Log): Promise<boolean> {
        const database = await Container.get<DatabaseService>(DatabaseService);

        try {
            if (undefined === this.logRepository) {
                this.logRepository = database.getRepository(Log);
            }

            await this.logRepository.save(log);
        } catch (err) {
            // tslint:disable-next-line
            console.log(err);
        }

        return true;
    }

    private async writeLog(log: Log) {
        const logFilePaths = [
            nodePath.join(this.applicationConfig.rootPath, 'var', this.contextConfig.context.toLowerCase(), 'log', log.level + '.log'),
            nodePath.join(this.applicationConfig.rootPath, 'var', this.contextConfig.context.toLowerCase(), 'log', log.contextType, log.contextName, log.level + '.log'),
        ];

        let output = '[' + this.dateToString(log.date) + '] ';
        output += '[' + log.level + '] ';
        output += '[' + log.contextType + '/' + log.contextName + '] ';
        output += '[' + log.message + ']';
        output = output.replace(/\r?\n?/g, '').trim();

        for (const logFilePath of logFilePaths) {
            // check if log file exists and create if not
            await FileSystemUtil.ensureFileExists(logFilePath);

            // check if log rotation is necessary
            // await this._rotateLogFile(logFile);

            // write line to log file
            await FileSystemUtil.appendFile(logFilePath, output + '\n');
        }
    }

    private async writeToConsole(log: Log): Promise<void> {
        // disabled, if log level less then notice and in mode production
        if (this.contextConfig.isProduction() && log.code > 5) {
            return;
        }

        const output = [];
        output.push('[' + log.level + ']');
        output.push('[' + log.contextType + '/' + log.contextName + ']');
        output.push(log.message);

        if (0 > log.data.length) {
            output.push('[' + log.data + ']');
        }

        output.push('[pid:' + process.pid + ']');

        const colors: { [key: number]: string } = {
            0: '\x1b[31m',
            1: '\x1b[31m',
            2: '\x1b[31m',
            3: '\x1b[31m',
            4: '\x1b[33m',
            5: '\x1b[34m',
            6: '\x1b[34m',
            7: '\x1b[37m',
        };

        // disabled, if context in mode test
        if (this.contextConfig.isTest()) {
            return;
        }

        // tslint:disable-next-line
        console.log(
            colors[log.code],
            output
                .join(' ')
                .replace(/\r?\n?/g, '')
                .trim(),
            '\x1b[0m',
        );
    }

    private dateToString(date: Date): string {
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + date.toTimeString().slice(0, 8);
    }
}
