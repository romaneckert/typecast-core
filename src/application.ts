import { Autoloader } from './core/autoloader';
import { Container } from './core/container';
import { DatabaseService } from './service/database-service';
import { ServerService } from './service/server-service';

export class Application {
    private autoloader: Autoloader;
    private paths: string[];

    constructor(paths?: string[]) {
        if (undefined === paths) {
            this.paths = [process.cwd()];
        } else {
            this.paths = paths;
        }

        this.autoloader = new Autoloader();
    }

    public async start() {
        await this.autoloader.load(this.paths);

        const database = Container.get<DatabaseService>(DatabaseService);
        database.start();

        const server = Container.get<ServerService>(ServerService);
        server.start();
    }
}
