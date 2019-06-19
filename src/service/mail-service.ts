import * as nodemailer from 'nodemailer';
import * as querystring from 'querystring';
import * as url from 'url';

import { ContainerAware } from '../core/container-aware';

export class MailService extends ContainerAware {
    private transporter: any;

    public async start() {
        const mailUrl = url.parse(String(this.container.config.mail.url));

        mailUrl.search = querystring.stringify({
            connectionTimeout: this.container.config.mail.connectionTimeout,
        });

        this.transporter = nodemailer.createTransport(url.format(mailUrl), {
            from: this.container.config.mail.defaultFrom,
        });
    }

    public async send(options: { [key: string]: any }): Promise<boolean> {
        return this.transporter.sendMail(options);
    }
}
