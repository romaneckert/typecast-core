import { Component } from '../core/component';
import { IApplicationConfig } from '../interface/config/application-config-interface';

@Component('config', 'application')
export class ApplicationConfig implements IApplicationConfig {
    public allowedContexts: string[] = ['production', 'acceptance', 'staging', 'test', 'development'];
    public baseUrl: string;
    public buildDate: Date = new Date();
    public context: string = 'production';
    public paths: string[] = [process.cwd()];
    public rootPath: string = process.cwd();

    constructor() {
        // baseUrl
        this.baseUrl = String(process.env.NODE_ENV);

        // context
        const processEnv = String(process.env.NODE_ENV);

        if (-1 !== this.allowedContexts.indexOf(processEnv)) {
            this.context = processEnv;
        }
    }

    public validate() {
        if ('string' !== typeof this.baseUrl || 0 === this.baseUrl.length) {
            throw new Error('baseUrl is empty');
        }

        if (undefined !== this.paths && 0 < this.paths.length) {
            throw new Error('extensionPaths is empty');
        }
    }
}
