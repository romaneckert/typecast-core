import { createServer, Server } from 'https';
import express from 'express';
import ServiceDecorator from '../decorator/service.decorator';
import LoggerService from './logger.service';

@ServiceDecorator()
export default class HTTPServerService {
    private _port: number | undefined;

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
        this._port = undefined;
        await this.logger.notice('http server stopped');

        return true;
    }

    public get port(): number | undefined {
        return this._port;
    }

    protected async listen(port: number): Promise<boolean> {
        if (undefined !== this._port) {
            await this.logger.error('http server already started');
            return false;
        }

        try {
            await new Promise((resolve, reject) => {
                this.connection = this.server
                    .listen({ port }, () => {
                        this._port = port;
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
