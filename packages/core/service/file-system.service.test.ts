import ApplicationService from './application.service';
import FileSystemService from './file-system.service';
import path from 'path';
import { file } from '@babel/types';

test('file-system', async () => {
    const fileSystem = await ApplicationService.create<FileSystemService>(FileSystemService);
    const pathToTestDir = './var/test/file-system/';
    const testFile1 = 'test-file-1.txt';
    const testFile2 = 'test-file-2.txt';
    const pathToTestFile1 = path.join(pathToTestDir, testFile1);
    const pathToTestFile2 = path.join(pathToTestDir, testFile2);
    const testString = 'test-string';

    // ensureDirExists
    await fileSystem.ensureFileExists(pathToTestFile1);

    // symlink
    await fileSystem.symlink(testFile1, pathToTestFile2);

    // isSylink
    expect(await fileSystem.isSymlink(pathToTestDir)).toBe(false);
    expect(await fileSystem.isSymlink(pathToTestFile1)).toBe(true);
    expect(await fileSystem.isSymlink(pathToTestFile2)).toBe(false);

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

    // link
    await fileSystem.symlink(pathToTestFile1, pathToTestFile2);

    // rename
    await fileSystem.rename(pathToTestFile1, pathToTestFile2);

    // isFile
    expect(await fileSystem.isFile(pathToTestFile1)).toBe(false);
    expect(await fileSystem.isFile(pathToTestFile2)).toBe(true);
});
