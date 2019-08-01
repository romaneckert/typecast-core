import * as nodePath from 'path';
import Container from '../core/container';
import Application from '../application';
import ApplicationConfig from './application-config';
import FileSystemUtil from '../util/file-system';

const app: Application = new Application();
let applicationConfig: ApplicationConfig;

beforeAll(async () => {
    await app.start();
    applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
});
afterAll(async () => {
    await app.stop();
});

test('application-config', async () => {
    expect(applicationConfig.buildDate.getTime() < new Date().getTime()).toBe(true);
    expect(applicationConfig.paths.length).toBe(1);
    expect(applicationConfig.rootPath).toBe(process.cwd());

    await FileSystemUtil.rename(nodePath.join(applicationConfig.rootPath, 'package.json'), nodePath.join(applicationConfig.rootPath, '_package.json'));
    expect(() => applicationConfig.version).toThrow();
    await FileSystemUtil.rename(nodePath.join(applicationConfig.rootPath, '_package.json'), nodePath.join(applicationConfig.rootPath, 'package.json'));

    expect(applicationConfig.version.length > 0).toBe(true);
    expect(applicationConfig.version.length > 0).toBe(true);
    expect(applicationConfig.version.length > 0).toBe(true);
});
