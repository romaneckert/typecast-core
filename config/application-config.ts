import * as nodePath from 'path';
import { Config } from '../decorator/config';
import { FileSystemUtil } from '../util/file-system';

@Config()
// TODO: use getter for validation
export class ApplicationConfig {
    public buildDate: Date = new Date();
    public paths: string[];
    public rootPath: string = process.cwd();
    public version: string;

    constructor() {
        // version
        const pathToPackageJson = nodePath.join(this.rootPath, 'package.json');

        if (!FileSystemUtil.isFileSync(pathToPackageJson)) {
            throw new Error(`${pathToPackageJson} does not exists`);
        }

        const data = JSON.parse(String(FileSystemUtil.readFileSync(pathToPackageJson)));

        this.version = String(data.version);
    }

    public validate() {
        if ('object' !== typeof this.paths || 0 === this.paths.length) {
            throw new Error('paths is empty');
        }
    }
}
