import ServiceDecorator from '../decorator/service.decorator';
import express from 'express';

@ServiceDecorator()
export default class HTTPServerService {
    private app: express.Application;

    constructor() {
        this.app = express();
    }

    public start(): void {
        this.app.listen();
    }
}
