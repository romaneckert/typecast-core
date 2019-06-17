import * as nodePath from 'path';
import { Connection, Repository } from 'typeorm';
import { ApplicationConfig } from '../config/application-config';
import { Log } from '../entity/log';
import { ILogger } from '../interface/logger-interface';
import { FileSystemService } from './file-system-service';

export class LoggerService implements ILogger {
    public databaseConnection: Connection;
    private logRepository: Repository<Log>;
    private contextType: string;
    private contextName: string;
    private maxSizePerLogFile: number = 16 * 1024 * 1024;
    private maxLogRotationsPerType: number = 10;
    private maxHistoryLength: number = 1000;
    private duplicateTime: number = 10000;
    private applicationConfig: ApplicationConfig;
    private fileSystemService: FileSystemService;

    public constructor(
        contextType: string,
        contextName: string,
        applicationConfig: ApplicationConfig,
        fileSystemService: FileSystemService,
    ) {
        this.contextType = contextType;
        this.contextName = contextName;
        this.applicationConfig = applicationConfig;
        this.fileSystemService = fileSystemService;
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
        this.fileSystemService.remove(nodePath.join(process.cwd(), 'var', this.applicationConfig.context, 'log'));
    }

    private async log(code: number, message: string, data?: any): Promise<void> {
        const date = new Date();

        // trim message
        message = message.trim();

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        const log = new Log(code, date, this.contextType, this.contextName, message);

        if (undefined !== this.databaseConnection) {
            const logRepository = this.databaseConnection.getRepository(Log);

            try {
                await logRepository.save(log);
            } catch (err) {
                // TODO: handle error
            }
        }

        await this.writeLog(log);
        this.writeToConsole(log);
    }

    private async writeLog(log: Log) {
        const logFilePaths = [
            nodePath.join(
                this.applicationConfig.basePath,
                'var',
                this.applicationConfig.context,
                'log',
                log.level + '.log',
            ),
            nodePath.join(
                this.applicationConfig.basePath,
                'var',
                this.applicationConfig.context,
                'log',
                log.contextType,
                log.contextName,
                log.level + '.log',
            ),
        ];

        let output = '[' + this.dateToString(log.date) + '] ';
        output += '[' + log.level + '] ';
        output += '[' + log.contextType + '/' + log.contextName + '] ';
        output += '[' + log.message + ']';
        output = output.replace(/\r?\n?/g, '').trim();

        for (const logFilePath of logFilePaths) {
            // check if log file exists and create if not
            await this.fileSystemService.ensureFileExists(logFilePath);

            // check if log rotation is necessary
            // await this._rotateLogFile(logFile);

            // write line to log file
            await this.fileSystemService.appendFile(logFilePath, output + '\n');
        }
    }

    private writeToConsole(log: Log): void {
        // disabled, if log level less then notice and in mode production
        if ('production' === this.applicationConfig.context && log.code > 5) {
            return;
        }

        // disabled, if context in mode test
        if ('test' === this.applicationConfig.context) {
            return;
        }

        let consoleOutput = '';

        consoleOutput += `[${log.level}] `;
        consoleOutput += `[${log.contextType}/${log.contextName}] `;
        consoleOutput += `${log.message} `;

        consoleOutput += `[pid:${process.pid}] `;

        // tslint:disable-next-line
        console.log(consoleOutput.replace(/\r?\n?/g, '').trim());
    }

    private dateToString(date: Date): string {
        return (
            date.getFullYear() +
            '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + date.getDate()).slice(-2) +
            ' ' +
            date.toTimeString().slice(0, 8)
        );
    }
}
