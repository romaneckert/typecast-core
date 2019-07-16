import { Config } from '../decorator/config';

@Config()
// TODO: use getter for validation
export class MailConfig {
    public host?: string = process.env.MAIL_HOST;
    public port?: number = Number(process.env.MAIL_PORT);
    public defaultFrom?: string = process.env.MAIL_DEFAULT_FROM;
    public connectionTimeout: number = 2000;

    public validate() {
        if ('string' !== typeof this.host || 0 === this.host.length) {
            throw new Error(`host not set or not valid - Environment Variable: MAIL_HOST - example: localhost`);
        }

        if ('number' !== typeof this.port) {
            throw new Error(`port not set or not valid - Environment Variable: MAIL_PORT - example: 25`);
        }

        if ('string' !== typeof this.defaultFrom || 0 === this.defaultFrom.length) {
            throw new Error(`defaultFrom not set or not valid - Environment Variable: MAIL_DEFAULT_FROM - example: noreply@domain.com`);
        }
    }
}
