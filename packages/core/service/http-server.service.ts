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
        return await this.listen(3000);
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

    protected async listen(port: number): Promise<boolean> {
        try {
            await new Promise((resolve, reject) => {
                this.connection = this.app.listen({ port }, resolve).on('error', reject);
            });
        } catch (err) {
            this.logger.warning(`cannot listen on port ${port} - try to start server on port ${port + 1}`);
            return await this.listen(port + 1);
        }

        return true;
    }
}
