import { IApplication } from './interface/application-interface';
import { IService } from './interface/service-interface';

export abstract class Application implements IApplication {
  public abstract service: IService[];

  public boot() {
    for (const service of this.service) {
      service.start();
    }
  }
}
