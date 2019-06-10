import { ServiceInterface } from '../interface/service-interface';
import { LoggerInterface } from '../interface/logger-interface';

export class ServerService implements ServiceInterface {

  logger: LoggerInterface

  constructor(logger: LoggerInterface, config: Object = {}) {
    this.logger = logger;
  }

  public start(): void {
    this.logger.log('start');
  }
}
