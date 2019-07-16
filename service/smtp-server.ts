import { Service } from '../decorator/service';
import { SMTPServer } from 'smtp-server';
import { SMTPServerConfig } from '../config/smtp-server-config';
import { LoggerService } from './logger';

@Service()
export class SMTPServerService {
    private config: SMTPServerConfig;
    private server: SMTPServer;
    private logger: LoggerService;

    public constructor(config: SMTPServerConfig, logger: LoggerService) {
        this.config = config;
        this.logger = logger;

        this.server = new SMTPServer({
            onConnect: this.onConnect,
            onData: this.onData,
        });
    }

    public async start(): Promise<void> {
        // https://github.com/normartin/ts-smtp-test/blob/master/src/smtp-test-server.ts

        console.log('promise before start');

        await new Promise(resolve => {
            console.log('promise start');

            this.server.listen(this.config.port, 'localhost', () => {
                this.logger.notice(`started with port: ` + this.config.port);
                resolve();
                console.log('resolve');
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
