import { ILogger } from '../interface/logger-interface';
import { IService } from '../interface/service-interface';

export class ServerService implements IService {
    public logger: ILogger;

    constructor(logger: ILogger, config: object = {}) {
        this.logger = logger;
    }

    public async start(): Promise<void> {
        await this.logger.info('server started');

        // TODO: start server
    }

    public stop() {
        // TODO: stop server
    }
}
