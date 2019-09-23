export default class EnvironmentVariableError extends Error {
    constructor(variableName: string, example: string | number) {
        super(`${variableName} not set or not valid - example: ${example}`);
    }
}
