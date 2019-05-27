import { Application } from '../src/app';

test('server', () => {

    let app = new Application();

    app.boot();

    app.service.logger.log('test');


    //expect(app.service.server.start()).toBe(undefined);
});