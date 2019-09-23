import * as dotenv from 'dotenv';
import * as nodePath from 'path';
import * as cluster from 'cluster';
import * as os from 'os';
import Autoloader from './core/autoloader';
import Container from './core/container';
import ApplicationConfig from './config/application-config';
import DatabaseService from './service/database';
import I18nService from './service/i18n';
import MailService from './service/mail';
import HTTPServerService from './service/http-server';
import FileSystemUtil from './util/file-system';
import ContextConfig from './config/context-config';
import SMTPServerService from './service/smtp-server';

// kill process on unhandled promise rejection
process.on('unhandledRejection', err => {
    throw err;
});

export default class Application {
    private paths: string[];
    private autoloader: Autoloader;

    constructor(paths: string[] = [process.cwd()]) {
        this.paths = paths;

        const pathToDotEnv = nodePath.join(process.cwd(), '.env.' + String(process.env.NODE_ENV).toLowerCase());

        if (!FileSystemUtil.isFileSync(pathToDotEnv)) {
            throw new Error(pathToDotEnv + ' does not exists.');
        }

        dotenv.config({ path: pathToDotEnv });

        this.autoloader = new Autoloader();
    }

    public async start(): Promise<void> {
        await this.autoloader.load(this.paths);

        const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
        applicationConfig.paths = this.paths;

        if (cluster.isMaster && applicationConfig.cluster) {
            for (const cpu of os.cpus()) {
                cluster.fork();
            }
            return;
        }

        const contextConfig = await Container.get<ContextConfig>(ContextConfig);

        const database = await Container.get<DatabaseService>(DatabaseService);
        await database.start();

        if (contextConfig.isTest()) {
            const smtp = await Container.get<SMTPServerService>(SMTPServerService);
            await smtp.start();
        }

        const i18n = await Container.get<I18nService>(I18nService);
        await i18n.start();

        const mail = await Container.get<MailService>(MailService);
        await mail.start();

        const server = await Container.get<HTTPServerService>(HTTPServerService);
        await server.start();
    }

    public async stop(): Promise<void> {
        const server = await Container.get<HTTPServerService>(HTTPServerService);
        await server.stop();

        const contextConfig = await Container.get<ContextConfig>(ContextConfig);

        if (contextConfig.isTest()) {
            const smtp = await Container.get<SMTPServerService>(SMTPServerService);
            await smtp.stop();
        }

        const database = await Container.get<DatabaseService>(DatabaseService);
        await database.stop();
    }
}
