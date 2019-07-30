import { Config } from '../decorator/config';
import EnvironmentVariable from '../core/environment-variable';

@Config()
export class ApplicationConfig {
    public buildDate: Date = new Date();
    public paths: string[] = [process.cwd()];

    public get rootPath(): string {
        return process.cwd();
    }

    public get version(): string {
        return EnvironmentVariable.get('npm_package_version', '1.0.0');
    }
}
