import * as nodemailer from 'nodemailer';
import * as querystring from 'querystring';
import * as url from 'url';
import { MailConfig } from '../config/mail-config';
import { Container } from '../core/container';
import { Service } from '../decorator/service';

@Service()
export class MailService {
    private config: MailConfig;

    private transporter: any;

    public async start() {
        this.config = await Container.get<MailConfig>(MailConfig);

        const mailUrl = url.parse(String(this.config.url));

        mailUrl.search = querystring.stringify({
            connectionTimeout: this.config.connectionTimeout,
        });

        this.transporter = nodemailer.createTransport(url.format(mailUrl));
    }

    public async send(options: { from?: string; to: string; subject: string; text?: string | undefined; html?: string | undefined }): Promise<boolean> {
        if (undefined === options.from) {
            options.from = this.config.defaultFrom;
        }

        return this.transporter.sendMail(options);
    }
}
