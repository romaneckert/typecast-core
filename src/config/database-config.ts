import { IConfig } from '../interface/config-interface';

export class DatabaseConfig implements IConfig {
    public host: string = 'localhost';
    public database?: string = process.env.DB_DATABASE;

    public validate() {
        if ('string' !== typeof this.database || 0 === this.database.length) {
            throw new Error('database is empty');
        }
    }
}
