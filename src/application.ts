import { UserController } from './controller/user-controller';
import { IApplication } from './interface/application-interface';
import { LoggerService } from './service/logger-service';
import { ServerService } from './service/server-service';
import { FileSystem } from './util/fs';

export class Application implements IApplication {
  public controller: {
    user: UserController;
  };

  public service: {
    logger: LoggerService;
    server: ServerService;
  };

  public util: {
    fs: FileSystem;
  };

  constructor() {
    const logger = new LoggerService();

    this.service = {
      logger,
      server: new ServerService(logger),
    };

    this.controller = {
      user: new UserController(logger),
    };

    this.util = {
      fs: new FileSystem(),
    };
  }

  public boot() {
    console.log('...booting');

    for (const service of Object.values(this.service)) {
      service.start();
    }
  }
}
