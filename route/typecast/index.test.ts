import axios from 'axios';
import url from 'url';
// import { ServerConfig } from '../../config/server-config';
import { Application } from '../../core/application';
import { Container } from '../../core/container';

test('route/typecast/index', async () => {
    const app = new Application();
    await app.start();

    /*
    const serverConfig = await Container.get<ServerConfig>(ServerConfig);

    const response = await axios.get(url.resolve(serverConfig.baseUrl, 'typecast'));
    expect(response.status).toBe(200);
    */

    await app.stop();
});
