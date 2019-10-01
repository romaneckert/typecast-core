import EnvironmentVariableError from '../error/environment-variable.error';
import FileSystemUtil from './file-system.util';
import EnvironmentVariableInterface from '../interface/environment-variable.interface';

export default class EnvironmentUtil {
    public static getVariable(environmentVariable: EnvironmentVariableInterface): string {
        this.writeToDotEnvExample(environmentVariable);

        // write to .env.example
        // try load env variables
        // try load dotenv variables and overwrite if not exists
        // try to get variable from env
        // if not exists throw error

        return 'asdfdsf';
        // this._variables[environmentVariable.name] = environmentVariable;
    }

    public static async load(): Promise<void> {
        // sort this._variables
        const orderedVariables: { [name: string]: { example: string | string[] | number | number[] | boolean; value: string | boolean | number | undefined; required: boolean } } = {};
        Object.keys(this._variables)
            .sort()
            .forEach(key => {
                orderedVariables[key] = this._variables[key];
            });

        this._variables = orderedVariables;

        // check in NODE_ENV registered
        if (undefined === this._variables.NODE_ENV) {
            throw new Error('please register environment variable NODE_ENV');
        }

        for (const name of Object.keys(this._variables)) {
            await this._loadVariableFromEnv(name);
        }

        // ensure .env.example exists
        await FileSystemUtil.ensureFileExists('.env.example');

        // ensure .env.context exists
        // await FileSystemUtil.ensureFileExists('.env.' + this.getVariable('NODE_ENV'));

        // load variable from file
    }

    protected static _variables: { [name: string]: any } = {};

    protected static writeToDotEnvExample(environmentVariable: EnvironmentVariableInterface) {
        const pathToDotEnvExample = '.env.example';

        FileSystemUtil.ensureFileExistsSync(pathToDotEnvExample);
    }

    protected static async _loadVariableFromEnv(name: string): Promise<void> {
        const conf = this._variables[name];

        if ('undefined' === typeof conf) {
            throw new Error(`variable ${name} not registered`);
        }

        await this._loadVariable(name, process.env[name]);
    }

    protected static async _loadVariable(name: string, value: string | undefined): Promise<void> {
        const conf = this._variables[name];

        if ('string' !== typeof value || 0 === value.length) {
            throw new EnvironmentVariableError(name, conf.example);
        }

        switch (typeof conf.example) {
            case 'string':
                this._variables[name].value = value;
                break;
            case 'number':
                if ('string' === typeof value) {
                    if (0 === value.length) {
                        throw new EnvironmentVariableError(name, conf.example);
                    }

                    this._variables[name].value = Number(value);
                }

                // check if value is valid number
                if (Number.isNaN(this._variables[name].value)) {
                    throw new EnvironmentVariableError(name, conf.example);
                }

                this._variables[name].value = value;
                break;
            case 'boolean':
                if ('number' !== typeof value) {
                    throw new EnvironmentVariableError(name, conf.example);
                }

                this._variables[name].value = Boolean(value);
                break;
        }
    }
}
