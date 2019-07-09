import { Application } from '../application';
import { Container } from '../core/container';
import { LoggerService } from './logger';

test('service/logger', async () => {
    const app = new Application();
    await app.start();

    const logger = await Container.get<LoggerService>(LoggerService);
    logger.contextType = 'test';
    logger.contextName = 'test';

    await logger.alert('alert message');
    await logger.critical('critical message');
    await logger.debug('debug message');
    await logger.emergency('emergency message');
    await logger.error('error message');
    await logger.info('info message');
    await logger.notice('notice message');
    await logger.warning('warning message');

    await logger.removeAllLogFiles();

    await app.stop();
});
