import ApplicationService from './application.service';
import HTTPServerService from './http-server.service';

test('http-service', async () => {
    const httpServer = await ApplicationService.create<HTTPServerService>(HTTPServerService);

    expect(await httpServer.start()).toBe(true);
    expect(await httpServer.start()).toBe(false);
    expect(await httpServer.start()).toBe(false);
    expect(await httpServer.stop()).toBe(true);
    expect(await httpServer.stop()).toBe(false);
    expect(await httpServer.stop()).toBe(false);
    expect(await httpServer.start()).toBe(true);

    expect(typeof httpServer.port).toBe('number');

    expect(await httpServer.stop()).toBe(true);

    expect(httpServer.port).toBe(undefined);
});
