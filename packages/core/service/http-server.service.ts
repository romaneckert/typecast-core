import { createServer, Server } from 'https';
import express from 'express';
import ServiceDecorator from '../decorator/service.decorator';
import LoggerService from './logger.service';

// TODO: certificates
// TODO: load port from conf
// TODO: optimize test with already blocked port
@ServiceDecorator()
export default class HTTPServerService {

    private server: Server;
    private connection: Server | undefined;
    private logger: LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;

        this.server = createServer(
            {
                // cert: await FileSystemUtil.readFile(this.pathToCertPem),
                // key: await FileSystemUtil.readFile(this.pathToKeyPem),
            },
            express(),
        );
    }

    public async start(): Promise<boolean> {
        return await this.listen(80);
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
            await this.logger.error('http server already listen');
            return false;
        }

        delete this.connection;
        await this.logger.notice('http server stopped');

        return true;
    }

    public get port(): number | undefined {
        if (undefined === this.connection) {
            return undefined;
        }

        const address = this.connection.address();

        if ('object' === typeof address && null !== address) {
            return address.port;
        }

        return undefined;
    }

    protected async listen(port: number): Promise<boolean> {
        if (undefined !== this.port) {
            await this.logger.error('http server already listen');
            return false;
        }

        try {
            await new Promise((resolve, reject) => {
                this.connection = this.server
                    .listen({ port }, () => {
                        resolve();
                    })
                    .on('error', reject);
            });
        } catch (err) {
            await this.logger.warning(`cannot listen on port ${port} - try to start server on port ${port + 1}`);
            return await this.listen(port + 1);
        }

        return true;
    }
}
