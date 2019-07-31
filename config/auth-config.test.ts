import Container from '../core/container';
import AuthConfig from './auth-config';
import Application from '../core/application';

const app: Application = new Application();
let authConfig: AuthConfig;

beforeAll(async () => {
    await app.start();
    authConfig = await Container.get<AuthConfig>(AuthConfig);
});
afterAll(async () => {
    await app.stop();
});

test('auth-config', async () => {
    expect(typeof authConfig.redirectPath).toBe('string');
    expect(authConfig.redirectPath.length).toBeGreaterThan(0);
    expect(typeof authConfig.tokenCookieName).toBe('string');
    expect(authConfig.tokenCookieName.length).toBeGreaterThan(0);
    expect(typeof authConfig.tokenExpiresIn).toBe('number');
    expect(authConfig.tokenExpiresIn).toBeGreaterThan(0);
    expect(typeof authConfig.secret).toBe('string');
    expect(authConfig.secret.length).toBeGreaterThan(10);

    const defaultAppSecret = process.env.APP_SECRET;
    delete process.env.APP_SECRET;
    expect(() => authConfig.secret).toThrow('APP_SECRET not set or not valid');
    process.env.APP_SECRET = 'test';
    expect(() => authConfig.secret).toThrow('APP_SECRET not set or not valid');
    process.env.APP_SECRET = defaultAppSecret;
});
