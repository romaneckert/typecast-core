export class ApplicationConfig {
    public baseUrl: string = 'http://localhost:3000';
    public allowedContexts: string[] = ['production', 'acceptance', 'staging', 'test', 'development'];
    public context: string = 'production';
    public basePath: string = process.cwd();
    public buildDate: Date = new Date();

    constructor() {
        // detect context and write to this.context
        const processEnv = String(process.env.NODE_ENV);

        if (-1 !== this.allowedContexts.indexOf(processEnv)) {
            this.context = processEnv;
        }
    }
}
