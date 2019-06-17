import { IApplication } from './interface/application-interface';
import { IService } from './interface/service-interface';

export abstract class Application implements IApplication {
    public abstract service: {};
}
