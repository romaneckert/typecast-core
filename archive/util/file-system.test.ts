import * as nodePath from 'path';
import Container from '../core/container';
import FileSystemUtil from './file-system';
import ApplicationConfig from '../config/application-config';

test('remove', async () => {
    const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
    const pathToTestFile = nodePath.join(applicationConfig.rootPath, 'var/test/file-system/remove.txt');
    await FileSystemUtil.ensureFileExists(pathToTestFile);
    expect(await FileSystemUtil.isFile(pathToTestFile)).toBe(true);
    await FileSystemUtil.remove(pathToTestFile);
    expect(await FileSystemUtil.isFile(pathToTestFile)).toBe(false);
});

test('isFile', async () => {
    const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
    const pathToTestFile = nodePath.join(applicationConfig.rootPath, 'var/test/file-system/isFile.txt');
    await FileSystemUtil.ensureFileExists(pathToTestFile);
    expect(await FileSystemUtil.isFile(pathToTestFile)).toBe(true);
    await FileSystemUtil.remove(pathToTestFile);
    expect(await FileSystemUtil.isFile(pathToTestFile)).toBe(false);
});

test('isFileSync', async () => {
    const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
    const pathToTestFile = nodePath.join(applicationConfig.rootPath, 'var/test/file-system/isFile.txt');
    await FileSystemUtil.ensureFileExists(pathToTestFile);
    expect(FileSystemUtil.isFileSync(pathToTestFile)).toBe(true);
    await FileSystemUtil.remove(pathToTestFile);
    expect(FileSystemUtil.isFileSync(pathToTestFile)).toBe(false);
});
