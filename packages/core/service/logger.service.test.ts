import LoggerService from './logger.service';

test('logger', async () => {
    let logger: LoggerService;

    // test not allowed registerClass after first create
    try {
        logger = new LoggerService('invalidType', 'test');
    } catch (e) {
        expect(e.message).toBe('type "invalidtype" is not allowed');
    }

    logger = new LoggerService('service', 'test');

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
