import { IConfig } from '../interface/config-interface';

export class ApplicationConfig implements IConfig {
    public applicationPaths: string[] = [process.cwd()];
    public allowedContexts: string[] = ['production', 'acceptance', 'staging', 'test', 'development'];
    public basePath: string = process.cwd();
    public baseUrl?: string = process.env.APP_BASE_URL;
    public buildDate: Date = new Date();
    public context: string = 'production';
    public extensionPaths?: string[] = undefined;

    constructor() {
        // detect context and write to this.context
        const processEnv = String(process.env.NODE_ENV);

        if (-1 !== this.allowedContexts.indexOf(processEnv)) {
            this.context = processEnv;
        }
    }

    public validate() {
        if ('string' !== typeof this.baseUrl || 0 === this.baseUrl.length) {
            throw new Error('baseUrl is empty');
        }

        if (undefined !== this.extensionPaths && 0 < this.extensionPaths.length) {
            throw new Error('extensionPaths is empty');
        }
    }
}
