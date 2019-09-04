import * as nodePath from 'path';
import FileSystemUtil from '../util/file-system';

export default class Autoloader {
    public autoloadedFilesCounter = 0;

    public async load(paths: string[]): Promise<void> {
        for (const path of paths) {
            for (const fileName of await FileSystemUtil.readDirectory(path)) {
                const filePath = nodePath.join(path, fileName);

                if (!['config', 'middleware', 'route', 'service', 'view-helper'].includes(fileName)) {
                    continue;
                }

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
            } else if (
                (await FileSystemUtil.isFile(filePath)) &&
                (nodePath.parse(filePath).ext === '.js' || nodePath.parse(filePath).ext === '.ts') &&
                -1 === filePath.indexOf('.test.') &&
                -1 === filePath.indexOf('.d.')
            ) {
                this.autoloadedFilesCounter++;

                await import(filePath);
            }
        }
    }
}
