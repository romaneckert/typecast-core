import Container from '../core/container';
import Application from '../application';
import DatabaseConfig from './database-config';

const app: Application = new Application();
let databaseConfig: DatabaseConfig;

beforeAll(async () => {
    await app.start();
    databaseConfig = await Container.get<DatabaseConfig>(DatabaseConfig);
});
afterAll(async () => {
    await app.stop();
});

test('database-config', async () => {
    expect(typeof databaseConfig.database).toBe('string');
    expect(typeof databaseConfig.host).toBe('string');
    expect(() => databaseConfig.password).toThrow();
    expect(() => databaseConfig.username).toThrow();
});
