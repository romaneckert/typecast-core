import { Application } from '../src/application';

test('logger', async () => {
    const app = new Application();
    await app.start();

    app.logger.removeAllLogFiles();

    app.logger.alert('alert test');
    app.logger.critical('critical test');
    app.logger.debug('debug test');
    app.logger.emergency('emergency test');
    app.logger.error('error test');
    app.logger.info('info test');
    app.logger.notice('notice test');
    app.logger.warning('warning test');

    await app.stop();
});
