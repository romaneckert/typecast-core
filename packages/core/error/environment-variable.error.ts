// TODO: optimize for types
export default class EnvironmentVariableError extends Error {
    constructor(variableName: string, example?: string | string[] | number | number[] | boolean) {
        if ('boolean' === typeof example) {
            example = Number(example);
        }

        if ('undefined' === typeof example) {
            super(`${variableName} not set or not valid`);
        } else {
            super(`${variableName} not set or not valid - example: ${example}`);
        }
    }
}
