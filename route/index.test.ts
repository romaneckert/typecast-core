import axios from 'axios';
import { ServerConfig } from '../config/server-config';
import { Application } from '../core/application';
import { Container } from '../core/container';

test('route/index', async () => {
    const app = new Application();
    await app.start();

    const serverConfig = await Container.get<ServerConfig>(ServerConfig);

    const response = await axios.get(serverConfig.baseUrl);
    expect(response.data.includes('Welcome to Typecast')).toBe(true);

    await app.stop();
});
