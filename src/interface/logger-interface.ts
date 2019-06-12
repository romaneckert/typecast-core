import { IService } from './service-interface';

export interface ILogger extends IService {
  log(message: string): boolean;
}
