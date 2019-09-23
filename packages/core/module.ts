import ModuleDecorator from './decorator/module.decorator';
import IndexController from './controller/index.controller';
import HTTPServerService from './service/http-server.service';

@ModuleDecorator({
    controllers: [IndexController],
    services: [HTTPServerService]
})
export default class CoreModule {}
