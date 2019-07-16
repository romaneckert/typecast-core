import * as nodemailer from 'nodemailer';
import * as querystring from 'querystring';
import * as url from 'url';
import { MailConfig } from '../config/mail-config';
import { Service } from '../decorator/service';
import { ContextConfig } from '../config/context-config';

@Service()
export class MailService {
    private config: MailConfig;
    private contextConfig: ContextConfig;

    private transporter: any;

    public constructor(config: MailConfig, contextConfig: ContextConfig) {
        this.config = config;
        this.contextConfig = contextConfig;
    }

    public async start() {
        // TODO: use single config settings
        const mailUrl = url.parse(String(this.config.url));

        const options: any = {
            connectionTimeout: this.config.connectionTimeout,
            host: mailUrl.host,
            port: mailUrl.port,
            localAddress: mailUrl.host,
        };

        // allow self signed smtp certificates for test smtp server
        if (this.contextConfig.isTest()) {
            options.tls = {
                rejectUnauthorized: false,
            };
        }

        this.transporter = nodemailer.createTransport(options);
    }

    public async send(options: { from?: string; to: string; subject: string; text?: string | undefined; html?: string | undefined }): Promise<void> {
        if (undefined === options.from) {
            options.from = this.config.defaultFrom;
        }
        try {
            setTimeout(async () => {
                await this.transporter.sendMail(options);
            }, 1000);
        } catch (err) {
            console.log(err);
        }
    }
}
