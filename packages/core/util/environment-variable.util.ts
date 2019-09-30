import FileSystemUtil from './file-system.util';
import dotenv from 'dotenv';

export default class EnvironmentVariableUtil {
    public static async get(name: string, example: string): Promise<string>;
    public static async get(name: string, example: number): Promise<number>;
    public static async get(name: string, example: string | number): Promise<string | number> {
        // ensure .env.example exists
        const pathToEnvExampleFile = '.env.example';
        await FileSystemUtil.ensureFileExists(pathToEnvExampleFile);

        // read .env.example
        const envExampleFileContent = await FileSystemUtil.readFile(pathToEnvExampleFile);
        const envExampleConfig = dotenv.parse(envExampleFileContent);

        console.log(envExampleConfig);

        // set value from process.env
        let value: string | number | undefined = process.env[name];

        // check if value is string
        if ('string' !== typeof value || 0 === value.length) {
            throw new Error(`${name} not set or not valid - example: ${example}`);
        }

        // check if value is numeric
        if ('string' !== typeof example) {
            value = Number(value);

            // check if value is valid number
            if (Number.isNaN(value)) {
                throw new Error(`${name} not set or not valid - example: ${example}`);
            }
        }

        return value;
    }
}
