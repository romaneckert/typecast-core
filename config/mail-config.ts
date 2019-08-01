import { Config } from '../decorator/config';
import EnvironmentVariable from '../core/environment-variable';

@Config()
export class MailConfig {

    private _host = {
        environmentVariable: 'MAIL_HOST',
        example: 'localhost',
        default: 'localhost'
    }

    public get host(): string {
        return EnvironmentVariable.get('MAIL_HOST', 'localhost');
    }

    public get port(): number {
        return EnvironmentVariable.get('MAIL_PORT', 25);
    }

    public get defaultFrom(): string {
        return EnvironmentVariable.get('MAIL_DEFAULT_FROM', 'noreply@typecast');
    }

    public get connectionTimeout(): number {
        try {
            return EnvironmentVariable.get('MAIL_CONNECTION_TIMEOUT', 2000);
        } catch (err) {
            return 2000;
        }
    }
}
