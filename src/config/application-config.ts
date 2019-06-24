import { Config } from '../decorator/config';
import { IConfig } from '../interface/config';

@Config()
export class ApplicationConfig implements IConfig {
    public allowedContexts: string[] = ['production', 'acceptance', 'staging', 'test', 'development'];
    public baseUrl: string;
    public buildDate: Date = new Date();
    public context: string = 'production';
    public paths: string[];
    public rootPath: string = process.cwd();

    constructor() {
        // baseUrl
        this.baseUrl = String(process.env.APP_BASE_URL);

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

        if ('object' !== typeof this.paths || 0 === this.paths.length) {
            throw new Error('paths is empty');
        }
    }
}
