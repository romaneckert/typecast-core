import { IService } from './iservice';

export interface IMailService extends IService {
    send(options: { [key: string]: any }): Promise<boolean>;
}
