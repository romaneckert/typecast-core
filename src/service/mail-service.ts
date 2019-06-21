import * as nodemailer from 'nodemailer';
import * as querystring from 'querystring';
import * as url from 'url';
import { Component } from '../core/component';
import { Inject } from '../core/inject';
import { IMailConfig } from '../interface/config/mail-config-interface';
import { IMailService } from '../interface/service/mail-service-interface';

@Component('service', 'mail')
export class MailService implements IMailService {
    @Inject('config', 'mail')
    private config: IMailConfig;

    private transporter: any;

    public async start() {
        const mailUrl = url.parse(String(this.config.url));

        mailUrl.search = querystring.stringify({
            connectionTimeout: this.config.connectionTimeout,
        });

        this.transporter = nodemailer.createTransport(url.format(mailUrl), {
            from: this.config.defaultFrom,
        });
    }

    public async send(options: { [key: string]: any }): Promise<boolean> {
        return this.transporter.sendMail(options);
    }
}
