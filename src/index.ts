import { Application } from './application';
import { Container } from './core/container';

(async () => {
    const app = new Application();
    await app.start();
})();
