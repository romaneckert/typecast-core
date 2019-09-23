import Config from '../decorator/config';
import EnvironmentVariable from '../core/environment-variable';
import EnvironmentVariableError from '../error/environment-variable';

@Config()
export default class ContextConfig {
    public allowedContexts: string[] = ['production', 'acceptance', 'staging', 'test', 'development'];

    public get context(): string {
        const context = EnvironmentVariable.get('NODE_ENV', 'production');

        if (-1 === this.allowedContexts.indexOf(context)) {
            throw new EnvironmentVariableError('NODE_ENV', 'production | acceptance | staging | test | development');
        }

        return context;
    }

    public isProduction() {
        return this.context === 'production';
    }

    public isAcceptance() {
        return this.context === 'acceptance';
    }

    public isStaging() {
        return this.context === 'staging';
    }

    public isTest() {
        return this.context === 'test';
    }

    public isDevelopment() {
        return this.context === 'development';
    }
}
