import { IService } from './iservice';
import { ILogger } from './ilogger';

export class Server implements IService {

  logger: ILogger

  constructor(logger: ILogger, config: Object = {}) {
    this.logger = logger;
  }

  public start(): void {
    // console.log('start');
  }
}
