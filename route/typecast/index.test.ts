import axios from 'axios';
import { Application } from '../../core/application';
import Container from '../../core/container';
import HTTPServerConfig from '../../config/http-server-config';
const app: Application = new Application();

beforeAll(async () => {
    await app.start();
});
afterAll(async () => {
    await app.stop();
});

test('/', async () => {
    const httpServerConfig = await Container.get<HTTPServerConfig>(HTTPServerConfig);
    const response = await axios.get(httpServerConfig.baseUrl);
    expect(response.data.includes('Welcome to Typecast')).toBe(true);
});
