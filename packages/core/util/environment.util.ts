import dotenv from 'dotenv';
import EnvironmentVariableError from '../error/environment-variable.error';
import FileSystemUtil from './file-system.util';
import EnvironmentVariableInterface from '../interface/environment-variable.interface';

export default class EnvironmentUtil {
    public static getValue(environmentVariable: EnvironmentVariableInterface): string | number | boolean {
        // check if value already set and return
        if (undefined !== this._values[environmentVariable.name]) {
            return this._values[environmentVariable.name];
        }

        // register NODE_ENV if not exists
        if (undefined === this._values.NODE_ENV) {
            this._variables.NODE_ENV = {
                name: 'NODE_ENV',
                example: 'production',
                allowedValues: ['production', 'staging', 'acceptance', 'test', 'development'],
                required: true,
            };

            this._values.NODE_ENV = this._getValueFromEnv('NODE_ENV');
        }

        // load context.env
        if (!this._contextDotEnvLoaded) {
            this._loadContextDotEnv();
        }

        this._variables[environmentVariable.name] = environmentVariable;

        return (this._values[environmentVariable.name] = this._getValueFromEnv(environmentVariable.name));
    }

    protected static _contextDotEnvLoaded: boolean = false;
    protected static _variables: { [name: string]: EnvironmentVariableInterface } = {};
    protected static _values: { [name: string]: string | number | boolean } = {};

    protected static _loadContextDotEnv(): void {
        const pathToContextDotEnv = this._values.NODE_ENV + '.env';
        FileSystemUtil.ensureFileExistsSync(pathToContextDotEnv);

        dotenv.config({ path: pathToContextDotEnv });
        this._contextDotEnvLoaded = true;
    }

    protected static _updateDotEnvFiles(): void {
        const orderedVariables: { [name: string]: EnvironmentVariableInterface } = {};
        Object.keys(this._variables)
            .sort()
            .forEach(key => {
                orderedVariables[key] = this._variables[key];
            });

        this._variables = orderedVariables;

        const pathToExampleDotEnv = 'example.env';

        FileSystemUtil.removeSync(pathToExampleDotEnv);
        FileSystemUtil.ensureFileExistsSync(pathToExampleDotEnv);

        const data = [];

        for (const [name, environmentVariable] of Object.entries(this._variables)) {
            if (name === 'NODE_ENV') {
                continue;
            }
            let example = environmentVariable.example;

            if ('boolean' === typeof example) {
                example = Number(example);
            }

            const comments = [];

            if (environmentVariable.required) {
                comments.push('required');
            } else {
                comments.push('optional');
            }

            data.push(`${name}=${example} # ` + comments.join(' - '));
        }

        FileSystemUtil.appendFileSync(pathToExampleDotEnv, data.join('\n'));
    }

    protected static _getValueFromEnv(name: string): string | number | boolean {
        const environmentVariable = this._variables[name];
        let value = process.env[name] as any;

        if ('string' !== typeof value || 0 === value.length) {
            this._updateDotEnvFiles();
            throw new EnvironmentVariableError(environmentVariable);
        }

        if ('string' === typeof environmentVariable.example) {
            return value;
        }

        value = Number(value);

        // check if value is valid number
        if (Number.isNaN(value)) {
            this._updateDotEnvFiles();
            throw new EnvironmentVariableError(environmentVariable);
        }

        if ('number' === typeof environmentVariable.example) {
            return value;
        }

        return Boolean(value);
    }
}