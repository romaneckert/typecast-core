import * as nodeFs from 'fs';
import * as nodePath from 'path';

export class FileSystemService {
    public async ensureFileExists(path: string): Promise<void> {
        try {
            return await nodeFs.promises.access(path, nodeFs.constants.R_OK);
        } catch (err) {
            await this.ensureDirExists(nodePath.dirname(path));
        }

        return await nodeFs.promises.appendFile(path, '');
    }

    public async ensureDirExists(path: string): Promise<void> {
        return await nodeFs.promises.mkdir(path, { recursive: true });
    }

    public async appendFile(path: string, data: any): Promise<void> {
        return nodeFs.promises.appendFile(path, data);
    }
}
