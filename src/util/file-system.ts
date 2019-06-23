import * as nodeFs from 'fs';
import * as nodePath from 'path';

export class FileSystemUtil {
    public static async remove(path: nodeFs.PathLike): Promise<void> {
        if ((await this.isFile(path)) || (await this.isSymbolicLink(path))) {
            await nodeFs.promises.unlink(path);
        } else if (await this.isDirectory(path)) {
            for (const file of await nodeFs.promises.readdir(path)) {
                await this.remove(nodePath.join(path.toString(), file));
            }

            await nodeFs.promises.rmdir(path);
        }
    }

    public static async isFile(path: nodeFs.PathLike): Promise<boolean> {
        let stats = null;

        try {
            stats = await nodeFs.promises.lstat(path);
        } catch (err) {
            return false;
        }

        return stats.isFile();
    }

    public static async isSymbolicLink(path: nodeFs.PathLike): Promise<boolean> {
        let stats = null;

        try {
            stats = await nodeFs.promises.lstat(path);
        } catch (err) {
            return false;
        }

        return stats.isSymbolicLink();
    }

    public static async isDirectory(path: nodeFs.PathLike): Promise<boolean> {
        let stats = null;

        try {
            stats = await nodeFs.promises.lstat(path);
        } catch (err) {
            return false;
        }

        return stats.isDirectory();
    }

    public static async isSymbolicLinkToDirectory(path: nodeFs.PathLike): Promise<boolean> {
        let stats = null;

        try {
            stats = await nodeFs.promises.stat(path);
        } catch (err) {
            return false;
        }

        return stats.isDirectory() && (await this.isSymbolicLink(path));
    }

    public static async ensureFileExists(path: nodeFs.PathLike): Promise<void> {
        try {
            return await nodeFs.promises.access(path, nodeFs.constants.R_OK);
        } catch (err) {
            await this.ensureDirExists(nodePath.dirname(path.toString()));
        }

        return await nodeFs.promises.appendFile(path, '');
    }

    public static async ensureDirExists(path: nodeFs.PathLike): Promise<void> {
        return await nodeFs.promises.mkdir(path, { recursive: true });
    }

    public static async appendFile(path: nodeFs.PathLike, data: any): Promise<void> {
        return nodeFs.promises.appendFile(path, data);
    }

    public static async readFile(path: nodeFs.PathLike, options?: any): Promise<Buffer> {
        if (undefined === options) {
            options = 'utf8';
        }

        return nodeFs.promises.readFile(path, options);
    }

    public static async readDirectory(path: nodeFs.PathLike): Promise<string[]> {
        return nodeFs.promises.readdir(path);
    }
}
