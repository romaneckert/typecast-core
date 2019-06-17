import { Application } from './application';

(async () => {
    const app = new Application();
    await app.logger.removeAllLogFiles();
    await app.start();
})();
