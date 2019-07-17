import * as dotenv from 'dotenv';
import * as nodePath from 'path';
import { ApplicationConfig } from '../config/application-config';
import { DatabaseService } from '../service/database';
import { I18nService } from '../service/i18n';
import { MailService } from '../service/mail';
import { HTTPServerService } from '../service/http-server';
import { FileSystemUtil } from '../util/file-system';
import { Autoloader } from './autoloader';
import { Container } from './container';
import { ContextConfig } from '../config/context-config';
import { SMTPServerService } from '../service/smtp-server';

// kill process on unhandled promise rejection
process.on('unhandledRejection', err => {
    throw err;
});

export class Application {
    private paths: string[];
    private autoloader: Autoloader;

    constructor(paths?: string[]) {
        if (undefined === paths) {
            this.paths = [process.cwd()];
        } else {
            this.paths = paths;
        }

        const pathToDotEnv = nodePath.join(process.cwd(), '.env.' + String(process.env.NODE_ENV).toLowerCase());

        if (!FileSystemUtil.isFileSync(pathToDotEnv)) {
            throw new Error(pathToDotEnv + ' does not exists.');
        }

        dotenv.config({ path: pathToDotEnv });

        this.autoloader = new Autoloader();
    }

    public async start() {
        await this.autoloader.load(this.paths);

        const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
        applicationConfig.paths = this.paths;

        for (const config of Object.values(await Container.getConfigs())) {
            if ('function' === typeof config.validate) {
                config.validate();
            }
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
