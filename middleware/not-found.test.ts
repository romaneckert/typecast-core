import axios from 'axios';
import url from 'url';
import { ServerConfig } from '../config/server-config';
import { Application } from '../core/application';
import { Container } from '../core/container';

test('middleware/not-found', async () => {
    const app = new Application();
    await app.start();

    const serverConfig = await Container.get<ServerConfig>(ServerConfig);

    try {
        await axios.get(url.resolve(serverConfig.baseUrl, 'path-that-does-not-exists'));
    } catch (err) {
        expect(err.response.status).toBe(404);
        expect(err.response.data.includes('<body>404</body>')).toBe(true);
    }

    try {
        await axios.get(url.resolve(serverConfig.baseUrl, 'path-that-does-not-exists'), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        expect(err.response.status).toBe(404);
        expect(err.response.data.status).toBe(404);
    }

    await app.stop();
});
