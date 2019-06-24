import { FileSystemUtil } from './file-system';

test('util/file-system', async () => {
    expect(await FileSystemUtil.isFile(__filename)).toBe(true);
    expect(await FileSystemUtil.isDirectory(__dirname)).toBe(true);
    expect(await FileSystemUtil.isDirectory(__filename)).toBe(false);
});
