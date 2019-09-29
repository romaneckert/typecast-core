import * as nodeFs from 'fs';
import * as nodePath from 'path';
import ServiceDecorator from '../decorator/service.decorator';

@ServiceDecorator()
export default class FileSystemService {
    public async symlink(target: string, path: string) {
        return nodeFs.promises.symlink(target, path);
    }

    public async rename(oldPath: string, newPath: string): Promise<void> {
        return nodeFs.promises.rename(oldPath, newPath);
    }

    public async remove(path: string): Promise<void> {
        if ((await this.isFile(path)) || (await this.isSymlink(path))) {
            await nodeFs.promises.unlink(path);
        } else if (await this.isDirectory(path)) {
            for (const file of await nodeFs.promises.readdir(path)) {
                await this.remove(nodePath.join(path.toString(), file));
            }

            await nodeFs.promises.rmdir(path);
        }
    }

    public async isFile(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isFile();
        } catch (err) {
            return false;
        }
    }

    public async isSymlink(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isSymbolicLink();
        } catch (err) {
            return false;
        }
    }

    public async isDirectory(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isDirectory();
        } catch (err) {
            return false;
        }
    }

    public async isSymlinkToDirectory(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.stat(path)).isDirectory() && (await this.isSymlink(path));
        } catch (err) {
            return false;
        }
    }

    public async ensureFileExists(path: string): Promise<void> {
        try {
            return await nodeFs.promises.access(path, nodeFs.constants.R_OK);
        } catch (err) {
            await this.ensureDirExists(nodePath.dirname(path.toString()));
        }

        return await nodeFs.promises.appendFile(path, '');
    }

    public async ensureDirExists(path: string): Promise<void> {
        return nodeFs.promises.mkdir(path, { recursive: true });
    }

    public async appendFile(path: string, data: any): Promise<void> {
        return nodeFs.promises.appendFile(path, data);
    }

    public async readFile(path: string): Promise<string> {
        return String(await nodeFs.promises.readFile(path, 'utf8'));
    }

    public async readDirectory(path: string): Promise<string[]> {
        return nodeFs.promises.readdir(path);
    }
}
