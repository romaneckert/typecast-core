import dotenv from 'dotenv';
import EnvironmentVariableError from '../error/environment-variable.error';
import FileSystemUtil from './file-system.util';
import EnvironmentVariableInterface from '../interface/environment-variable.interface';

export default class EnvironmentUtil {
    public static getValue(environmentVariable: EnvironmentVariableInterface): string | number | boolean {
        if (undefined !== this._values[environmentVariable.name]) {
            return this._values[environmentVariable.name];
        }

        if (undefined === this._values.NODE_ENV) { 
            if ('undefined' === typeof process.env.NODE_ENV) {
                throw new EnvironmentVariableError('NODE_ENV', 'production', ['production', 'staging', 'acceptance', 'test', 'development']);
            } 

            this._loadVariableFromEnv();
        }

        

        this._variables[environmentVariable.name] = environmentVariable;

        // try load env variables
        // try load dotenv variables and overwrite if not exists
        // try to get variable from env
        // if not exists write example file and throw error

        return 'asdfdsf';
        // this._variables[environmentVariable.name] = environmentVariable;
    }

    public static async load(): Promise<void> {
        // sort this._variables
        const orderedVariables: { [name: string]: EnvironmentVariableInterface } = {};
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

    protected static _variables: { [name: string]: EnvironmentVariableInterface } = {};
    protected static _values: { [name: string]: string | number | boolean } = {};

    protected static loadEnvironmentVariablesFromContextDotEnv() {
        dotenv.config({ path: context.env });
    }

    protected static writeToExampleDotEnv(environmentVariable: EnvironmentVariableInterface) {
        const pathToExampleDotEnv = 'example.env';

        FileSystemUtil.ensureFileExistsSync(pathToExampleDotEnv);
        const exampleDotEnvData = dotenv.parse(FileSystemUtil.readFileSync(pathToExampleDotEnv));

        const example = environmentVariable.example;

        if ('boolean' === typeof example) {
            exampleDotEnvData[environmentVariable.name] = String(Number(environmentVariable.example));
        } else if ('number' === typeof example) {
            exampleDotEnvData[environmentVariable.name] = String(environmentVariable.example);
        }

        exampleDotEnvData[environmentVariable.name] = String(environmentVariable.example);

        console.log(exampleDotEnvData);
    }

    protected static async _loadVariableFromEnv(name: string): Promise<void> {
        const conf = this._variables[name];

        if ('undefined' === typeof conf) {
            throw new Error(`variable ${name} not registered`);
        }

        await this._loadVariable(name, process.env[name]);
    }

    protected static async _loadVariable(name: string, value: string | undefined): Promise<void> {
        /*
        const conf = this._variables[name];

        if ('string' !== typeof value || 0 === value.length) {
            throw new EnvironmentVariableError(name, conf.example);
        }

        switch (typeof conf.example) {
            case 'string':
                this._values[name] = value;
                break;
            case 'number':
                if ('string' === typeof value) {
                    if (0 === value.length) {
                        throw new EnvironmentVariableError(name, conf.example);
                    }

                    this._values[name] = Number(value);
                }

                // check if value is valid number
                if (Number.isNaN(this._values[name])) {
                    throw new EnvironmentVariableError(name, conf.example);
                }

                this._values[name] = value;
                break;
            case 'boolean':
                if ('number' !== typeof value) {
                    throw new EnvironmentVariableError(name, conf.example);
                }

                this._values[name] = Boolean(value);
                break;
        }
        */
    }
}
