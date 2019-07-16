import { Config } from '../decorator/config';

@Config()
// TODO: use getter for validation
export class ContextConfig {
    private _context: string = 'production';
    private allowedContexts: string[] = ['production', 'acceptance', 'staging', 'test', 'development'];

    public constructor() {
        const processEnv = String(process.env.NODE_ENV);

        if (-1 !== this.allowedContexts.indexOf(processEnv)) {
            this._context = processEnv;
        } else {
            throw new Error('context is not valid');
        }
    }

    public get context(): string {
        return this._context;
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
