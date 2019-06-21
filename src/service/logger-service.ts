import * as nodePath from 'path';
import { Component } from '../core/component';
import { Inject } from '../core/inject';
import { Log } from '../entity/log';
import { IApplicationConfig } from '../interface/config/application-config-interface';
import { IFileSystemService } from '../interface/service/file-system-service-interface';
import { ILoggerService } from '../interface/service/logger-service-interface';
import { IStringService } from '../interface/service/string-service-interface';

@Component('service', 'logger')
export class LoggerService implements ILoggerService {
    @Inject('config', 'application')
    private applicationConfig: IApplicationConfig;

    @Inject('service', 'file-service')
    private fileSystem: IFileSystemService;

    @Inject('service', 'string')
    private string: IStringService;

    private contextType: string;
    private contextName: string;
    private maxSizePerLogFile: number = 16 * 1024 * 1024;
    private maxLogRotationsPerType: number = 10;
    private maxHistoryLength: number = 1000;
    private duplicateTime: number = 10000;

    constructor(contextType: string, contextName: string) {
        this.contextType = contextType;
        this.contextName = contextName;
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
        this.fileSystem.remove(nodePath.join(process.cwd(), 'var', this.applicationConfig.context, 'log'));
    }

    private async log(code: number, message: string, data?: any): Promise<void> {
        const date = new Date();

        // trim message
        message = message.trim();

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        // string type cast data
        data = this.string.cast(data);

        const log = new Log(code, date, this.contextType, this.contextName, message, data);

        await this.saveToDB(log);
        await this.writeLog(log);
        this.writeToConsole(log);
    }

    private async saveToDB(log: Log): Promise<boolean> {
        // await this.container.repository.log.save(log);
        return true;
    }

    private async writeLog(log: Log) {
        const logFilePaths = [
            nodePath.join(
                this.applicationConfig.rootPath,
                'var',
                this.applicationConfig.context.toLocaleUpperCase(),
                'log',
                log.level + '.log',
            ),
            nodePath.join(
                this.applicationConfig.rootPath,
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
            await this.fileSystem.ensureFileExists(logFilePath);

            // check if log rotation is necessary
            // await this._rotateLogFile(logFile);

            // write line to log file
            await this.fileSystem.appendFile(logFilePath, output + '\n');
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

        const consoleOutput = `[${log.level}] [${log.contextType}/${log.contextName}] ${log.message} [${log.data}] [pid:${process.pid}]`;

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
