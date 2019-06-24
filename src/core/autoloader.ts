import * as nodePath from 'path';
import { FileSystemUtil } from '../util/file-system';

export class Autoloader {
    public async load(paths: string[]): Promise<void> {
        for (const path of paths) {
            for (const fileName of await FileSystemUtil.readDirectory(path)) {
                const filePath = nodePath.join(path, fileName);

                if (await FileSystemUtil.isDirectory(filePath)) {
                    await this.import(filePath);
                }
            }
        }
    }

    private async import(path: string): Promise<void> {
        for (const fileName of await FileSystemUtil.readDirectory(path)) {
            const filePath: string = nodePath.join(path, fileName);

            if (await FileSystemUtil.isDirectory(filePath)) {
                await this.import(filePath);
            } else if ((await FileSystemUtil.isFile(filePath)) && nodePath.parse(filePath).ext === '.js') {
                await import(filePath);
            }
        }
    }
}
