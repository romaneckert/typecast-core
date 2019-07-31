import * as nodemailer from 'nodemailer';
import MailConfig from '../config/mail-config';
import { Service } from '../decorator/service';
import ContextConfig from '../config/context-config';

@Service()
export default class MailService {
    private mailConfig: MailConfig;
    private contextConfig: ContextConfig;

    private transporter: any;

    public constructor(config: MailConfig, contextConfig: ContextConfig) {
        this.mailConfig = config;
        this.contextConfig = contextConfig;
    }

    public async start() {
        const options: any = {
            connectionTimeout: this.mailConfig.connectionTimeout,
            host: this.mailConfig.host,
            port: this.mailConfig.port,
        };

        // allow self signed smtp certificates for test smtp server
        if (!this.contextConfig.isProduction()) {
            options.tls = {
                rejectUnauthorized: false,
            };
        }

        this.transporter = nodemailer.createTransport(options);
    }

    public async send(options: { from?: string; to: string; subject: string; text?: string | undefined; html?: string | undefined }): Promise<void> {
        if (undefined === options.from) {
            options.from = this.mailConfig.defaultFrom;
        }

        await this.transporter.sendMail(options);
    }
}
