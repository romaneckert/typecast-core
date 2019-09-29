import ConfigDecorator from '../decorator/controller.decorator';
import EnvironmentVariable from '../util/environment-variable';

@ConfigDecorator()
export default class ApplicationConfig {
    public buildDate: Date = new Date();

    public get rootPath(): string {
        return process.cwd();
    }

    public get cluster(): boolean {
        return Boolean(EnvironmentVariable.get('APP_CLUSTER', 1));
    }
}
