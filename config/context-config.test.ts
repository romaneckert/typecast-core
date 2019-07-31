import Application from '../core/application';
import Container from '../core/container';
import ContextConfig from './context-config';

const app: Application = new Application();
let contextConfig: ContextConfig;

beforeAll(async () => {
    await app.start();
    contextConfig = await Container.get<ContextConfig>(ContextConfig);
});
afterAll(async () => {
    await app.stop();
});

test('invalid', async () => {
    const nodeEnvDefault = process.env.NODE_ENV;

    process.env.NODE_ENV = 'invalid';
    expect(() => contextConfig.context).toThrow('NODE_ENV not set or not valid - example: production | acceptance | staging | test | development');
    process.env.NODE_ENV = nodeEnvDefault;
});

test('acceptance', async () => {
    expect(contextConfig.isAcceptance()).toBe(false);
});

test('development', async () => {
    expect(contextConfig.isDevelopment()).toBe(false);
});

test('production', async () => {
    expect(contextConfig.isProduction()).toBe(false);
});

test('staging', async () => {
    expect(contextConfig.isStaging()).toBe(false);
});

test('test', async () => {
    expect(contextConfig.isTest()).toBe(true);
});
