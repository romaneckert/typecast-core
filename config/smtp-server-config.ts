import { Config } from '../decorator/config';
import { EnvironmentVariableError } from '../error/environment-variable';
import { StringUtil } from '../util/string';

@Config()
export class SMTPServerConfig {
    public get port(): number {
        if (!StringUtil.isNumber(process.env.SMTP_SERVER_PORT)) {
            throw new EnvironmentVariableError('SMTP_SERVER_PORT', '25');
        }

        return Number(process.env.SMTP_SERVER_PORT);
    }
}
