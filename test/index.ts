import Application from '../src/application';
import CoreModule from '../src/core/index';

(async () => {
    const app = new Application([CoreModule]);
    await app.start();
})();
