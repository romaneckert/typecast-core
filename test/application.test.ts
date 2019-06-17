import { Application } from '../src/application';

test('application', async () => {
    const app = new Application();
    await app.start();
    await app.stop();
    //expect(app.logger.log('test')).toBe(true);
});
