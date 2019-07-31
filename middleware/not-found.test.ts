import axios from 'axios';
import Application from '../core/application';

const app: Application = new Application();

beforeAll(async () => {
    await app.start();
});
afterAll(async () => {
    await app.stop();
});

test('not-found', async () => {
    try {
        await axios.get('http://localhost:3000/path-that-does-not-exists');
    } catch (err) {
        expect(err.response.status).toBe(404);
        expect(err.response.data.includes('<body>404</body>')).toBe(true);
    }

    try {
        await axios.get('http://localhost:3000/path-that-does-not-exists', { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        expect(err.response.status).toBe(404);
        expect(err.response.data.status).toBe(404);
    }
});
