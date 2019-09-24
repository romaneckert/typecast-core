import ApplicationService from './application.service';
import LoggerService from './logger.service';

describe('service', () => {
    test('logger', async () => {
        const logger = await ApplicationService.create<LoggerService>(LoggerService);

        await logger.alert('alert message');
        await logger.critical('critical message');
        await logger.debug('debug message');
        await logger.emergency('emergency message');
        await logger.error('error message');
        await logger.info('info message');
        await logger.notice('notice message');
        await logger.warning('warning message');
    });
});
