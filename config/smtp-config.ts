import { Config } from '../decorator/config';

@Config()
export class SMTPConfig {
    public port: number = 3010;

    constructor() {
        if (undefined !== process.env.SMTP_PORT) {
            this.port = Number(process.env.SMTP_PORT);
        }
    }

    public validate() {
        if ('number' !== typeof this.port) {
            throw new Error(`port not valid - have to be number - example: '3010'`);
        }
    }
}
