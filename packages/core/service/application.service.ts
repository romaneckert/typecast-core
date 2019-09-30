import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
import EnvironmentVariable from '../util/environment-variable.util';
import FileSystemUtil from '../util/file-system.util';

export default class ApplicationService {
    public static registerClass(target: any, type: string) {
        if (this._created) {
            throw new Error('registerClass() not allowed after create() call');
        }

        if (undefined === this._classes[type]) {
            this._classes[type] = {};
            this._instances[type] = {};
        }

        this._classes[type][Object.keys(this._classes[type]).length] = target;
    }

    public static async create<T>(target: any): Promise<T> {
        // clean perviosly registered classes
        if (!this._created) {
            this._created = true;

            await this.loadDotEnvFile();
            await this.cleanClasses();
            await this.detectLoggerClass();
            await this.createInstances();
        }

        return this.createInstance(target);
    }

    public static get classes(): any {
        return this._classes;
    }

    public static get instances(): any {
        return this._instances;
    }

    private static _created: boolean = false;
    private static _classes: { [key: string]: { [key: string]: any } } = {};
    private static _loggerClass: any;
    private static _instances: { [key: string]: { [key: string]: any } } = {};

    private static async loadDotEnvFile() {
        const nodeEnv = await EnvironmentVariable.get('NODE_ENV', 'production');

        const pathToDotEnv = path.join(process.cwd(), '.env.' + nodeEnv.toLowerCase());

        if (!(await FileSystemUtil.isFile(pathToDotEnv))) {
            throw new Error(`${pathToDotEnv} does not exists`);
        }

        dotenv.config({ path: pathToDotEnv });
    }

    private static async createInstance(target: any): Promise<any> {
        let resolvedTarget: any = null;
        let resolvedType: string = '';
        let resolvedIndex: string = '';

        for (const [type, classes] of Object.entries(this._classes)) {
            if (null !== resolvedTarget) {
                break;
            }

            for (const [index, entry] of Object.entries(classes)) {
                if (target.isPrototypeOf(entry) || target === entry) {
                    resolvedIndex = index;
                    resolvedTarget = entry;
                    resolvedType = type;
                    break;
                }
            }
        }

        if (null === resolvedTarget) {
            throw new Error('class is not registered');
        }

        if (undefined !== this._instances[resolvedType] && undefined !== this._instances[resolvedType][resolvedIndex]) {
            return this._instances[resolvedType][resolvedIndex];
        }

        const instancesToInject = [];
        const classParameters = Reflect.getMetadata('design:paramtypes', resolvedTarget) || [];

        for (const classParameter of classParameters) {
            let instance = null;

            if (classParameter.isPrototypeOf(this._loggerClass) || classParameter === this._loggerClass) {
                instance = new this._loggerClass(resolvedType, resolvedTarget.name);
            } else {
                instance = await this.createInstance(classParameter);
            }

            instancesToInject.push(instance);
        }

        return (this._instances[resolvedType][resolvedIndex] = new resolvedTarget(...instancesToInject));
    }

    private static async createInstances(): Promise<void> {
        for (const classes of Object.values(this._classes)) {
            for (const entry of Object.values(classes)) {
                if (entry === this._loggerClass) {
                    continue;
                }

                await this.createInstance(entry);
            }
        }
    }

    private static async detectLoggerClass(): Promise<void> {
        for (const classes of Object.values(this._classes)) {
            for (const entry of Object.values(classes)) {
                if (
                    'function' === typeof entry.prototype.emergency &&
                    'function' === typeof entry.prototype.alert &&
                    'function' === typeof entry.prototype.critical &&
                    'function' === typeof entry.prototype.error &&
                    'function' === typeof entry.prototype.warning &&
                    'function' === typeof entry.prototype.notice &&
                    'function' === typeof entry.prototype.info &&
                    'function' === typeof entry.prototype.debug
                ) {
                    this._loggerClass = entry;
                }
            }
        }
    }

    private static async cleanClasses(): Promise<void> {
        for (const classes of Object.values(this._classes)) {
            for (const entry of Object.values(classes)) {
                if (await this.removePrototype(entry)) {
                    await this.cleanClasses();
                    return;
                }
            }
        }
    }

    private static async removePrototype(classToTest: any): Promise<boolean> {
        for (const [type, classes] of Object.entries(this._classes)) {
            for (const [index, entry] of Object.entries(classes)) {
                if (entry.isPrototypeOf(classToTest)) {
                    delete this._classes[type][index];
                    return true;
                }
            }
        }
        return false;
    }
}
