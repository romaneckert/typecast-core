export class EnvironmentVariableError extends Error {
    constructor(variableName: string, example: string) {
        const message = `${variableName} not set or not valid - example: ${example}`;
        super(message);
    }
}
