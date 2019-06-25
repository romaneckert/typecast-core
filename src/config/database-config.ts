import { Config } from '../decorator/config';
import { IConfig } from '../interface/config';

@Config()
export class DatabaseConfig implements IConfig {
    public host: string = 'localhost';
    public database?: string = process.env.DB_DATABASE;

    public validate() {
        if ('string' !== typeof this.host || 0 === this.host.length) {
            throw new Error(`host not set or not valid - have to be string - example: http://localhost:3000`);
        }

        if ('string' !== typeof this.database || 0 === this.database.length) {
            throw new Error(`database not set or not valid - have to be string - example: typecast-core`);
        }
    }
}
