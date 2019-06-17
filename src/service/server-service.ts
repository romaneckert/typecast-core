import { ILogger } from '../interface/logger-interface';

export class ServerService {
    public logger: ILogger;

    constructor(logger: ILogger, config: object = {}) {
        this.logger = logger;
    }

    public async start(): Promise<void> {
        await this.logger.notice('server started');

        // TODO: start server
    }

    public stop() {
        // TODO: stop server
    }
}
