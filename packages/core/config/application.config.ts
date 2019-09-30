import ConfigDecorator from '../decorator/config.decorator';
import EnvironmentUtil from '../util/environment.util';

@ConfigDecorator([['APP_CLUSTER', true, false], ['NODE_ENV', ['production', 'acceptance', 'staging', 'test', 'development'], true]])
export default class ApplicationConfig {
    protected _cluster: boolean;
    protected _context: string;
    protected _rootPath: string;
    protected _startDate: Date;

    constructor() {
        this._cluster = Boolean(EnvironmentUtil.getVariable('APP_CLUSTER'));
        this._context = String(EnvironmentUtil.getVariable('NODE_ENV'));
        this._rootPath = process.cwd();
        this._startDate = new Date();
    }

    public get cluster(): boolean {
        return this._cluster;
    }

    public get context(): string {
        return this._context;
    }

    public get rootPath(): string {
        return this._rootPath;
    }

    public get startDate(): Date {
        return this._startDate;
    }

    public isProduction(): boolean {
        return this._context === 'production';
    }

    public isAcceptance(): boolean {
        return this._context === 'acceptance';
    }

    public isStaging(): boolean {
        return this._context === 'staging';
    }

    public isTest(): boolean {
        return this._context === 'test';
    }

    public isDevelopment(): boolean {
        return this._context === 'development';
    }
}
