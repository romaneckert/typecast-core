import { ILogger } from '../interface/logger-interface';
import { IService } from '../interface/service-interface';

export class ServerService implements IService {

  public logger: ILogger

  constructor(logger: ILogger, config: object = {}) {
    this.logger = logger;
  }

  public start(): void {
    this.logger.log('start');
  }
}
