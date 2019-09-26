import 'reflect-metadata';

export default class ApplicationService {
    public static registerClass(target: any) {
        if (this._created) {
            throw new Error('registerClass() not allowed after create() call');
        }

        this._classes[Object.keys(this._classes).length] = target;
    }

    public static get classes(): any {
        return this._classes;
    }

    public static get instances(): any {
        return this._instances;
    }

    public static async create<T>(target: any): Promise<T> {
        // clean perviosly registered classes
        if (!this._created) {
            this._created = true;

            await this.cleanClasses();
            await this.createInstances();
        }

        let resolvedTarget = null;
        let resolvedIndex = null;

        for (const [index, entry] of Object.entries(this._classes)) {
            if (target.isPrototypeOf(entry) || target === entry) {
                resolvedIndex = index;
                resolvedTarget = entry;
                break;
            }
        }

        if (null === resolvedTarget || null === resolvedIndex) {
            throw new Error('class is not registered');
        }

        return this._instances[resolvedIndex];
    }

    private static _created: boolean = false;
    private static _classes: { [key: string]: any } = {};
    private static _instances: { [key: string]: any } = {};

    private static async createInstances(): Promise<void> {
        for (const [index, entry] of Object.entries(this._classes)) {
            const injections = [];
            const classParameters = Reflect.getMetadata('design:paramtypes', entry) || [];

            for (const classParameter of classParameters) {
                injections.push(await this.create<any>(classParameter));
            }

            const instance = new entry(...injections);
            this._instances[index] = instance;
        }
    }

    private static async cleanClasses(): Promise<void> {
        for (const [index, entry] of Object.entries(this._classes)) {
            if (await this.removePrototype(index, entry)) {
                await this.cleanClasses();
                return;
            }
        }
    }

    private static async removePrototype(indexToTest: string, classToTest: any): Promise<boolean> {
        for (const [index, entry] of Object.entries(this._classes)) {
            if (entry.isPrototypeOf(classToTest)) {
                delete this._classes[index];
                return true;
            }
        }

        return false;
    }
}
