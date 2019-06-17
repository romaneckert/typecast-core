import { Application } from './application';

const app = new Application();
app.logger.removeAllLogFiles();
app.start();
