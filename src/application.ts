import { Bundle } from './bundle';
import { Inject } from './core/inject';
import { ILogger } from './interface/service/logger-service-interface';

const bundles = [new Bundle()];

export class Application {
    @Inject('service', 'logger')
    public logger: ILogger;

    constructor(paths: string[]) {
        
    }

    start() {
        this.logger.info('test');
    }
}
