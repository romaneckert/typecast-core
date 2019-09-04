import Service from '../decorator/service';
import { SMTPServer } from 'smtp-server';
import SMTPServerConfig from '../config/smtp-server-config';
import LoggerService from './logger';

@Service()
export default class SMTPServerService {
    private smtpServerConfig: SMTPServerConfig;
    private server: SMTPServer;
    private logger: LoggerService;

    public constructor(config: SMTPServerConfig, logger: LoggerService) {
        this.smtpServerConfig = config;
        this.logger = logger;

        this.server = new SMTPServer({
            authOptional: true,
            // onConnect: this.onConnect,
            // onData: this.onData,
        });
    }

    public async start(): Promise<void> {
        // https://github.com/normartin/ts-smtp-test/blob/master/src/smtp-test-server.ts
        await new Promise((resolve, reject) => {
            try {
                this.server.listen(this.smtpServerConfig.port, 'localhost', () => {
                    // TODO: await on logger
                    // this.logger.notice(`started with port: ` + this.config.port);
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    public async stop() {
        await new Promise(resolve => {
            this.server.close(() => {
                // TODO: await on logger
                // this.logger.notice('stopped');
                resolve();
            });
        });
    }

    private onData(stream: any, session: any, callback: any) {
        // tslint:disable-next-line
        console.log('in');
    }

    private onConnect(session: any, callback: any) {
        // tslint:disable-next-line
        console.log(session);

        if (session.remoteAddress !== '127.0.0.1') {
            return callback(new Error('No connections from localhost allowed'));
        }
        return callback(); // Accept the connection
    }
}
