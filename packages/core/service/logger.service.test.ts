/* tslint:disable:no-empty */

import LoggerService from './logger.service';
import ApplicationUtil from '../util/application.util';

class TestClass {
    constructor(logger: LoggerService) {
        console.log(logger);
    }
}

test('logger', async () => {
    ApplicationUtil.registerClass(TestClass, 'invalid');

    try {
        await ApplicationUtil.create<TestClass>(TestClass);
    } catch (e) {
        expect(e.message).toBe('type "invalidtype" is not allowed');
    }

    return;

    const logger = await ApplicationUtil.create<LoggerService>(LoggerService);

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
