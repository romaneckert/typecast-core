import { Application } from './application';

test('application', async () => {
    const app = new Application();
    await app.start();
    await app.stop();

    const app2 = new Application([process.cwd()]);
    await app.start();
    await app.stop();
});
