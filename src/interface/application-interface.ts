import { ILogger } from './logger-interface';
import { IService } from './service-interface';

export interface IApplication {
  boot(): any;
}
