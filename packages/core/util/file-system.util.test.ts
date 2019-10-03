import FileSystemUtil from './file-system.util';
import path from 'path';

const pathToTest = path.join(process.cwd(), 'var/', 'test/');
const testDir1 = 'file-system-1';
const testDir2 = 'file-system-2';
const pathToTestDir1 = path.join(pathToTest, testDir1, '/');
const pathToTestDir2 = path.join(pathToTest, testDir2, '/');
const testFile1 = 'test-file-1.txt';
const testFile2 = 'test-file-2.txt';
const pathToTestFile1 = path.join(pathToTestDir1, testFile1);
const pathToTestFile2 = path.join(pathToTestDir2, testFile2);
const testString = 'test-string';

test('file-system', async () => {
    // isDirectory
    expect(await FileSystemUtil.isDirectory(pathToTestDir1)).toBe(false);
    expect(FileSystemUtil.isDirectorySync(pathToTestDir1)).toBe(false);

    // ensureDirExists
    await FileSystemUtil.ensureDirExists(pathToTestDir1);
    FileSystemUtil.ensureDirExistsSync(pathToTestDir2);

    // isDirectory
    expect(await FileSystemUtil.isDirectory(pathToTestDir1)).toBe(true);
    expect(FileSystemUtil.isDirectorySync(pathToTestDir2)).toBe(true);

    // ensureFileExists
    await FileSystemUtil.ensureFileExists(pathToTestFile2);

    // symlink file
    await FileSystemUtil.symlink(path.join('../', testDir2, testFile2), pathToTestFile1);

    // isSymlink
    expect(await FileSystemUtil.isSymlink(pathToTestDir1)).toBe(false);
    expect(FileSystemUtil.isSymlinkSync(pathToTestDir1)).toBe(false);
    expect(await FileSystemUtil.isSymlink(pathToTestFile1)).toBe(true);
    expect(FileSystemUtil.isSymlinkSync(pathToTestFile1)).toBe(true);
    expect(await FileSystemUtil.isSymlink(pathToTestFile2)).toBe(false);
    expect(FileSystemUtil.isSymlinkSync(pathToTestFile2)).toBe(false);

    // remove
    await FileSystemUtil.remove(pathToTestDir1);
    FileSystemUtil.removeSync(pathToTestDir2);

    // ensureDirExists
    await FileSystemUtil.ensureDirExists(pathToTestDir2);

    // symlink dir
    await FileSystemUtil.symlink(pathToTestDir2, path.join(pathToTest, testDir1));

    // isSymlink to dir
    expect(await FileSystemUtil.isSymlinkToDirectory(pathToTestDir2)).toBe(false);
    expect(await FileSystemUtil.isSymlinkToDirectory(path.join(pathToTest, testDir1))).toBe(true);
    expect(await FileSystemUtil.isSymlinkToDirectory(pathToTestFile1)).toBe(false);

    // remove pathToVar
    await FileSystemUtil.remove(pathToTest);

    // ensureDirExists
    await FileSystemUtil.ensureDirExists(pathToTestDir1);
    await FileSystemUtil.ensureDirExists(pathToTestDir2);

    // ensureFileExistsSync
    FileSystemUtil.ensureFileExistsSync(pathToTestFile1);

    // isFile
    expect(await FileSystemUtil.isFile(pathToTestFile1)).toBe(true);
    expect(FileSystemUtil.isFileSync(pathToTestFile1)).toBe(true);

    // remove
    await FileSystemUtil.remove(pathToTestFile1);

    // isFile
    expect(await FileSystemUtil.isFile(pathToTestFile1)).toBe(false);
    expect(FileSystemUtil.isFileSync(pathToTestFile1)).toBe(false);

    // ensureFileExists
    await FileSystemUtil.ensureFileExists(pathToTestFile1);

    // appendFile
    await FileSystemUtil.appendFile(pathToTestFile1, testString);

    // readFile
    expect(await FileSystemUtil.readFile(pathToTestFile1)).toBe(testString);
    expect(FileSystemUtil.readFileSync(pathToTestFile1)).toBe(testString);

    // rename
    await FileSystemUtil.rename(pathToTestFile1, pathToTestFile2);

    // isFile
    expect(await FileSystemUtil.isFile(pathToTestFile1)).toBe(false);
    expect(FileSystemUtil.isFileSync(pathToTestFile1)).toBe(false);
    expect(await FileSystemUtil.isFile(pathToTestFile2)).toBe(true);
    expect(FileSystemUtil.isFileSync(pathToTestFile2)).toBe(true);

    // readDir
    expect((await FileSystemUtil.readDirectory(pathToTestDir1)).length).toBe(0);
    expect((await FileSystemUtil.readDirectory(pathToTestDir2)).length).toBe(1);

    // remove pathToVar
    await FileSystemUtil.remove(pathToTest);
    await FileSystemUtil.remove(pathToTest);

    // isSymlink on not existing dir
    expect(await FileSystemUtil.isSymlink(pathToTest)).toBe(false);
    expect(FileSystemUtil.isSymlinkSync(pathToTest)).toBe(false);
});
