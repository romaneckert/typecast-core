import { Config } from '../decorator/config';
import EnvironmentVariable from '../core/environment-variable';

@Config()
export class SMTPServerConfig {
    public get port(): number {
        return EnvironmentVariable.get('SMTP_SERVER_PORT', 25);
    }
}
