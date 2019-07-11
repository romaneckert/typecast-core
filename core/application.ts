import * as dotenv from 'dotenv';
import * as nodePath from 'path';
import { ApplicationConfig } from '../config/application-config';
import { DatabaseService } from '../service/database';
import { I18nService } from '../service/i18n';
import { MailService } from '../service/mail';
import { ServerService } from '../service/server';
import { FileSystemUtil } from '../util/file-system';
import { Autoloader } from './autoloader';
import { Container } from './container';

export class Application {
    private paths: string[];

    constructor(paths?: string[]) {
        if (undefined === paths) {
            this.paths = [process.cwd()];
        } else {
            this.paths = paths;
        }
    }

    public async start() {
        const pathToDotEnv = nodePath.join(process.cwd(), '.env.' + String(process.env.NODE_ENV).toLowerCase());

        if (!(await FileSystemUtil.isFile(pathToDotEnv))) {
            throw new Error(pathToDotEnv + ' does not exists.');
        }

        dotenv.config({ path: pathToDotEnv });

        const autoloader = new Autoloader();
        await autoloader.load(this.paths);

        const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
        applicationConfig.paths = this.paths;

        for (const config of Object.values(await Container.getConfigs())) {
            if ('function' === typeof config.validate) {
                config.validate();
            }
        }

        const database = await Container.get<DatabaseService>(DatabaseService);
        await database.start();

        const i18n = await Container.get<I18nService>(I18nService);
        await i18n.start();

        const mail = await Container.get<MailService>(MailService);
        await mail.start();

        const server = await Container.get<ServerService>(ServerService);
        await server.start();
    }

    public async stop() {
        const server = await Container.get<ServerService>(ServerService);
        await server.stop();

        const database = await Container.get<DatabaseService>(DatabaseService);
        await database.stop();
    }
}
