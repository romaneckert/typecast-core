import Config from '../decorator/config';
import EnvironmentVariable from '../core/environment-variable';

@Config()
export default class DatabaseConfig {
    public get database(): string {
        return EnvironmentVariable.get('DB_DATABASE', 'typecast');
    }

    public get host(): string {
        return EnvironmentVariable.get('DB_HOST', 'localhost');
    }

    public get username(): string {
        return EnvironmentVariable.get('DB_USERNAME', 'root');
    }

    public get password(): string {
        return EnvironmentVariable.get('DB_PASSWORD', '********');
    }
}
