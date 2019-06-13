import { IService } from './service-interface';

export interface ILogger extends IService {
  type: string;
  name: string;

  log(message: string): boolean;
}
