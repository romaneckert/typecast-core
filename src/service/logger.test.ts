import { Application } from '../application';
import { Container } from '../core/container';
import { LoggerService } from './logger';

test('service/logger', async () => {
    const app = new Application();
    await app.start();

    const logger = await Container.get<LoggerService>(LoggerService);
    logger.contextType = 'test';
    logger.contextName = 'test';

    logger.info('info message');

    await app.stop();
});
