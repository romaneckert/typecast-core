import ApplicationService from './application.service';
import LoggerService from './logger.service';

describe('service', () => {
    test('logger', async () => {
        const logger = await ApplicationService.create<LoggerService>(LoggerService);

        await Promise.all([
            logger.alert('alert message'),
            logger.critical('critical message'),
            logger.debug('debug message'),
            logger.emergency('emergency message'),
            logger.error('error message'),
            logger.info('info message'),
            logger.notice('notice message'),
            logger.warning('warning message'),
        ]);
    });
});
