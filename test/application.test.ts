import { Application } from '../src/application';
import { LoggerService } from '../src/service/logger-service';
import { ServerService } from '../src/service/server-service';

class App extends Application {

    public service: [ServerService]

    constructor() {

        super();

        this.service = [
            new ServerService(new LoggerService('service', 'server'))
        ]
    }
}

test('application', () => {
    const app = new App();
    app.boot();
    //expect(app.logger.log('test')).toBe(true);
});