import ApplicationService from './application.service';
import FileSystemService from './file-system.service';
import path from 'path';
import { file } from '@babel/types';

test('file-system', async () => {
    const fileSystem = await ApplicationService.create<FileSystemService>(FileSystemService);
    const pathToTestDir = './var/test/file-system/';
    const pathToTestFile1 = path.join(pathToTestDir, 'test-file-1.txt');
    const pathToTestFile2 = path.join(pathToTestDir, 'test-file-2.txt');
    const testString = 'test-string';

    // isDirectory
    expect(await fileSystem.isDirectory(pathToTestDir)).toBe(false);

    // ensureDirExists
    await fileSystem.ensureDirExists(pathToTestDir);

    // isDirectory
    expect(await fileSystem.isDirectory(pathToTestDir)).toBe(true);

    // ensureFileExists
    await fileSystem.ensureFileExists(pathToTestFile1);

    // isFile
    expect(await fileSystem.isFile(pathToTestFile1)).toBe(true);

    // remove
    await fileSystem.remove(pathToTestFile1);

    // isFile
    expect(await fileSystem.isFile(pathToTestFile1)).toBe(false);

    // ensureFileExists
    await fileSystem.ensureFileExists(pathToTestFile1);

    // appendFile
    await fileSystem.appendFile(pathToTestFile1, testString);

    // readFile
    expect(await fileSystem.readFile(pathToTestFile1)).toBe(testString);

    // rename
    await fileSystem.rename(pathToTestFile1, pathToTestFile2);

    // isFile
    expect(await fileSystem.isFile(pathToTestFile1)).toBe(false);
    expect(await fileSystem.isFile(pathToTestFile2)).toBe(true);
});
