import axios from 'axios';
import url from 'url';
import Application from '../../core/application';
import Container from '../../core/container';
import HTTPServerConfig from '../../config/http-server-config';

const app: Application = new Application();

beforeAll(async () => {
    await app.start();
});
afterAll(async () => {
    await app.stop();
});

test('/api/doc', async () => {
    const httpServerConfig = await Container.get<HTTPServerConfig>(HTTPServerConfig);

    let response = await axios.get(url.resolve(httpServerConfig.baseUrl, 'api/doc'));
    expect(typeof response.data.info.title).toBe('string');

    response = await axios.get(url.resolve(httpServerConfig.baseUrl, 'api/doc'));
    expect(typeof response.data.info.title).toBe('string');
});
