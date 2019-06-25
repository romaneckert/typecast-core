import { Application } from './application';

test('application', async () => {
    const app = new Application();
    await app.start();
    await app.stop();
});
