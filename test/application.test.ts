import { Application } from '../src/application';
import { DatabaseService } from '../src/service/database-service';
import { LoggerService } from '../src/service/logger-service';
import { ServerService } from '../src/service/server-service';

class App extends Application {
    public service: {
        database: DatabaseService;
        server: ServerService;
    };

    constructor() {
        super();

        this.service = {
            database: new DatabaseService(new LoggerService('service', 'database')),
            server: new ServerService(new LoggerService('service', 'server')),
        };
    }

    public async start() {
        // start database service
        await this.service.database.start();

        // add database connection to all logger
        this.service.server.logger.databaseConnection = this.service.database.connection;
        this.service.database.logger.databaseConnection = this.service.database.connection;

        // start server service
        await this.service.server.start();
    }

    public async stop() {
        // stop database
        await this.service.database.stop();

        // stop server
        await this.service.server.stop();
    }
}

test('application', async () => {
    const app = new App();
    await app.start();
    await app.stop();
    //expect(app.logger.log('test')).toBe(true);
});
