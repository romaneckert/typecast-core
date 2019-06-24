import { Config } from '../decorator/config';
import { IConfig } from '../interface/config';

@Config()
export class MailConfig implements IConfig {
    public defaultFrom: string = 'default@typecast';
    public connectionTimeout: number = 2000;
    public url: string;

    constructor() {
        if (undefined === process.env.MAIL_URL) {
            this.url = '';
        } else {
            this.url = process.env.MAIL_URL;
        }
    }

    public validate() {
        if (0 === this.url.length) {
            throw new Error(`url not valid - have to be string - example: 'smtp://localhost:1025'`);
        }
    }
}
