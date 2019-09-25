import express from 'express';
import { Server } from 'http';
import ServiceDecorator from '../decorator/service.decorator';
import LoggerService from './logger.service';

@ServiceDecorator()
export default class HTTPServerService {
    private app: express.Application;
    private connection: Server | undefined;
    private logger: LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;
        this.app = express();
    }

    public async start(): Promise<boolean> {
        if (undefined !== this.connection) {
            await this.logger.error('http server already running');
            return false;
        }

        this.connection = this.app.listen();

        const address = this.connection.address();

        if ('object' === typeof address && null !== address) {
            await this.logger.notice('http server listening on port: ' + address.port);
        }

        return true;
    }

    public async stop(): Promise<boolean> {
        try {
            await new Promise((resolve, reject) => {
                if (undefined === this.connection) {
                    reject();
                } else {
                    this.connection.close(resolve);
                }
            });
        } catch (err) {
            await this.logger.error('http server already stopped');
            return false;
        }

        this.connection = undefined;
        await this.logger.notice('http server stopped');

        return true;
    }
}
