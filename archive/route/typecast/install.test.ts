import axios from 'axios';
import url from 'url';
import Application from '../../application';
import Container from '../../core/container';
import HTTPServerConfig from '../../config/http-server-config';
import DatabaseService from '../../service/database';

const app: Application = new Application();
let database: DatabaseService;

beforeAll(async () => {
    await app.start();
    database = await Container.get<DatabaseService>(DatabaseService);
});
afterAll(async () => {
    await app.stop();
});

test('setup project', async () => {
    // delete database to have a clean setup
    await database.drop();

    const httpServerConfig = await Container.get<HTTPServerConfig>(HTTPServerConfig);
    const response = await axios.post(url.resolve(httpServerConfig.baseUrl, 'typecast/install'), { email: 'test@test.typecast' });
    expect(response.data.includes('Please create your password')).toBe(true);
    expect(response.data.includes('Click on the link in the email you received')).toBe(true);
});
