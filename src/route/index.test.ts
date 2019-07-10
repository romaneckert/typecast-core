import axios from 'axios';
import { Application } from '../application';
import { ApplicationConfig } from '../config/application-config';
import { Container } from '../core/container';

test('route/index', async () => {
    const app = new Application();
    await app.start();

    const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);

    const response = await axios.get(applicationConfig.baseUrl + '/');
    expect(response.data.includes('Welcome to Typecast')).toBe(true);

    await app.stop();
});
