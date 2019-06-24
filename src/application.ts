import * as dotenv from 'dotenv';
import { ApplicationConfig } from './config/application-config';
import { Autoloader } from './core/autoloader';
import { Container } from './core/container';
import { DatabaseService } from './service/database';
import { I18nService } from './service/i18n';
import { MailService } from './service/mail';
import { ServerService } from './service/server';

export class Application {
    public autoloader: Autoloader;
    private paths: string[];

    constructor(paths?: string[]) {
        dotenv.config();

        if (undefined === paths) {
            this.paths = [process.cwd()];
        } else {
            this.paths = paths;
        }

        this.autoloader = new Autoloader();
    }

    public async start() {
        await this.autoloader.load(this.paths);

        const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
        applicationConfig.paths = this.paths;

        for (const config of Object.values(await Container.getConfigs())) {
            config.validate();
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
