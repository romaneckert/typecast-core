import ModuleDecorator from './decorator/module.decorator';
import HTTPServerService from './service/http-server.service';
import ModuleInterface from './interface/module.interface';
import IndexController from './controller/index.controller';

@ModuleDecorator({
    controllers: [IndexController],
})
export default class CoreModule implements ModuleInterface {
    protected httpServer: HTTPServerService;

    constructor(httpServer: HTTPServerService) {
        this.httpServer = httpServer;
    }

    public async start(): Promise<boolean> {
        return await this.httpServer.start();
    }

    public async stop(): Promise<boolean> {
        return await this.httpServer.stop();
    }
}
