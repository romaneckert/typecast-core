import { EnvironmentVariableError } from '../error/environment-variable';

// TODO: add cache
export default class EnvironmentVariable {

    public static get(name: string, example: string): string;
    public static get(name: string, example: number): number;
    public static get(name: string, example: string | number): string | number {
        // set value from process.env
        let value: string | number | undefined = process.env[name];

        // check if value is string
        if ('string' !== typeof value || 0 === value.length) {
            throw new EnvironmentVariableError(name, example);
        }

        // check if value is numeric
        if ('string' === typeof example) {
            return value;
        }

        value = Number(value);

        // check if value is valid number
        if (Number.isNaN(value)) {
            throw new EnvironmentVariableError(name, example);
        }

        return value;
    }
}
