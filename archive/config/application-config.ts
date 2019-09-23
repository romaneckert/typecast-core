import * as nodePath from 'path';
import Config from '../decorator/config';
import EnvironmentVariable from '../core/environment-variable';
import FileSystemUtil from '../util/file-system';

@Config()
export default class ApplicationConfig {
    public buildDate: Date = new Date();
    public paths: string[] = [process.cwd()];
    private _version: string;

    public get rootPath(): string {
        return process.cwd();
    }

    public get cluster(): boolean {
        return Boolean(EnvironmentVariable.get('APP_CLUSTER', 1));
    }

    public get version(): string {
        if (undefined !== this._version) {
            return this._version;
        }

        const pathToPackageJson = nodePath.join(this.rootPath, 'package.json');

        if (!FileSystemUtil.isFileSync(pathToPackageJson)) {
            throw new Error(`${pathToPackageJson} does not exists`);
        }

        const data = JSON.parse(String(FileSystemUtil.readFileSync(pathToPackageJson)));

        return (this._version = String(data.version));
    }
}
