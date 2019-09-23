import Application from './application';
import CoreModule from './core/index';

test('application', async () => {
    const app = new Application([CoreModule]);
    await app.start();
});
