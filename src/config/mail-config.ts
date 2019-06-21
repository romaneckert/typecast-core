import { Component } from '../core/component';
import { IMailConfig } from '../interface/config/mail-config-interface';

@Component('config', 'mail')
export class MailConfig implements IMailConfig {
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
        if ('string' === typeof this.url && 0 === this.url.length) {
            throw new Error(`url not valid - have to be string - example: 'smtp://localhost:1025'`);
        }
    }
}
