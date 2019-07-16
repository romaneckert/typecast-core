import { Service } from '../decorator/service';
import { SMTPServer } from 'smtp-server';
import { SMTPConfig } from '../config/smtp-config';
import { LoggerService } from './logger';

@Service()
export class SMTPService {
    private config: SMTPConfig;
    private server: SMTPServer;
    private logger: LoggerService;

    public constructor(config: SMTPConfig, logger: LoggerService) {
        this.config = config;
        this.server = new SMTPServer({
            name: 'localhost',
            onConnect: this.onConnect,
            onData: this.onData,
        });
        this.logger = logger;
    }

    public async start(): Promise<void> {
        // https://github.com/normartin/ts-smtp-test/blob/master/src/smtp-test-server.ts

        return new Promise((resolve, reject) => {
            this.server.listen(this.config.port, 'localhost', async () => {
                console.log(`started with port: ` + this.config.port);
                await this.logger.notice(`started with port: ` + this.config.port);
                resolve();
            });
        });
    }

    public async stop() {
        console.log('smtp server stopped');

        return new Promise((resolve, reject) => {
            this.server.close(resolve);
        });
    }

    private onData(stream: any, session: any, callback: any) {
        console.log('in');
    }

    private onConnect(session: any, callback: any) {
        console.log(session);

        if (session.remoteAddress !== '127.0.0.1') {
            return callback(new Error('No connections from localhost allowed'));
        }
        return callback(); // Accept the connection
    }
}
