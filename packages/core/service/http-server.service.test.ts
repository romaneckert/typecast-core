import ApplicationService from './application.service';
import HTTPServerService from './http-server.service';

describe('service', () => {
    test('http-service', async () => {
        const httpServer = await ApplicationService.create<HTTPServerService>(HTTPServerService);

        expect(await httpServer.start()).toBe(true);
        expect(await httpServer.start()).toBe(false);
        expect(await httpServer.start()).toBe(false);
        expect(await httpServer.stop()).toBe(true);
        expect(await httpServer.stop()).toBe(false);
        expect(await httpServer.stop()).toBe(false);
        expect(await httpServer.start()).toBe(true);
    });
});
