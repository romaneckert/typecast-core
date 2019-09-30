import ConfigDecorator from '../decorator/controller.decorator';
import EnvironmentVariable from '../util/environment-variable.util';

@ConfigDecorator()
export default class ApplicationConfig {
    private _startDate: Date;
    private _cluster: boolean = false;

    constructor() {
        this._startDate = new Date();
        this._cluster = Boolean(EnvironmentVariable.get('APP_CLUSTER', 1));
    }

    public get rootPath(): string {
        return process.cwd();
    }

    public get cluster(): boolean {
        return this._cluster;
    }

    public get startDate(): Date {
        return this._startDate;
    }
}
