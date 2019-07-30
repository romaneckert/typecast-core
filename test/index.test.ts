import axios from 'axios';
import url from 'url';
import * as nodePath from 'path';
import { Application } from '../core/application';
import { HTTPServerConfig } from '../config/http-server-config';
import Container from '../core/container';
import { DatabaseService } from '../service/database';
import { SMTPServerConfig } from '../config/smtp-server-config';
import { EnvironmentVariableError } from '../error/environment-variable';

const app: Application = new Application();
let database: DatabaseService;

beforeAll(async () => {
    await app.start();
    database = await Container.get<DatabaseService>(DatabaseService);
});
afterAll(async () => {
    await app.stop();
});
describe('config', () => {
    test('smtp-server', async () => {
        let error;
        const defaultPort = process.env.SMTP_SERVER_PORT;

        const smtpServerConfig = await Container.get<SMTPServerConfig>(SMTPServerConfig);
        process.env.SMTP_SERVER_PORT = undefined;

        try {
            const port = smtpServerConfig.port;
        } catch (err) {
            error = err;
        }

        expect(error instanceof EnvironmentVariableError).toBe(true);

        process.env.SMTP_SERVER_PORT = defaultPort;
    });
});

describe('route', () => {
    test('/', async () => {
        const httpServerConfig = await Container.get<HTTPServerConfig>(HTTPServerConfig);
        const response = await axios.get(httpServerConfig.baseUrl);
        expect(response.data.includes('Welcome to Typecast')).toBe(true);
    });
});
describe('process', () => {
    test('setup project', async () => {
        // delete database to have a clean setup
        await database.drop();

        const httpServerConfig = await Container.get<HTTPServerConfig>(HTTPServerConfig);
        const response = await axios.post(url.resolve(httpServerConfig.baseUrl, 'typecast/install'), { email: 'test@test.typecast' });
        expect(response.data.includes('Please create your password')).toBe(true);
        expect(response.data.includes('Click on the link in the email you received')).toBe(true);
    });
});
