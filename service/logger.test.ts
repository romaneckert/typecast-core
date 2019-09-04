import Application from '../application';
import Container from '../core/container';
import LoggerService from './logger';

const app: Application = new Application();

beforeAll(async () => {
    await app.start();
});
afterAll(async () => {
    await app.stop();
});

test('logger', async () => {
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
});
