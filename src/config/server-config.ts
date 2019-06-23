import { Config } from '../decorator/config';
import { IConfig } from '../interface/config';

@Config()
export class ServerConfig implements IConfig {
    public port: number = 3000;

    public validate() {
        return;
    }
}
