import ServiceDecorator from '../decorator/service.decorator';
import express from 'express';
import { Server } from 'http';

@ServiceDecorator()
export default class HTTPServerService {
    private app: express.Application;
    private connection: Server | undefined;

    constructor() {
        this.app = express();
    }

    public async start(): Promise<boolean> {
        if (undefined !== this.connection) {
            return false;
        }

        this.connection = this.app.listen();

        return true;
    }

    public async stop(): Promise<boolean> {
        if (undefined === this.connection) {
            return false;
        }

        this.connection.close();
        this.connection = undefined;
        return true;
    }
}
