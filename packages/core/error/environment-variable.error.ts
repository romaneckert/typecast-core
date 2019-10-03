// TODO: optimize for types
export default class EnvironmentVariableError extends Error {
    constructor(variableName: string, example?: string | number | boolean, allowedValues?: string[] | number[]) {
        const parts = [`${variableName} not set or not valid`];

        if ('undefined' !== typeof example) {
            if ('boolean' === typeof example) {
                example = Number(example);
            }

            parts.push(`example: ${example}`);
        }

        if ('undefined' !== typeof allowedValues) {
            parts.push(`allowed values: ${allowedValues.join(' | ')}`);
        }

        super(parts.join(' - '));
    }
}
