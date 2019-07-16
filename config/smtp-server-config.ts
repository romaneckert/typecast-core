import { Config } from '../decorator/config';

@Config()
export class SMTPServerConfig {
    private _port?: number = Number(process.env.SMTP_SERVER_PORT);

    public get port(): number {
        if ('number' !== typeof this._port) {
            throw new Error(`port not set or not valid - Environment Variable: SMTP_SERVER_PORT - example: 25`);
        }

        return this._port;
    }
}
