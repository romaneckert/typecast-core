import * as nodePath from 'path';
import { Config } from '../decorator/config';
import { IConfig } from '../interface/config';
import { FileSystemUtil } from '../util/file-system';

@Config()
export class ApplicationConfig implements IConfig {
    public allowedContexts: string[] = ['production', 'acceptance', 'staging', 'test', 'development'];
    public baseUrl: string;
    public buildDate: Date = new Date();
    public context: string = 'production';
    public paths: string[];
    public rootPath: string = process.cwd();
    public version: string;

    constructor() {
        // baseUrl
        this.baseUrl = String(process.env.APP_BASE_URL);

        // context
        const processEnv = String(process.env.NODE_ENV);

        if (-1 !== this.allowedContexts.indexOf(processEnv)) {
            this.context = processEnv;
        }

        const pathToPackageJson = nodePath.join(process.cwd(), 'package.json');

        if (!FileSystemUtil.isFileSync(pathToPackageJson)) {
            throw new Error(`${pathToPackageJson} does not exists`);
        }

        const data = JSON.parse(String(FileSystemUtil.readFileSync(pathToPackageJson)));

        this.version = String(data.version);
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
