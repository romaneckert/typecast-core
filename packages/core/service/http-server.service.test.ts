import https from 'https';
import ApplicationService from './application.service';
import HTTPServerService from './http-server.service';

test('http-service', async () => {
    // create test server to block port 80

    https.createServer().listen(80);

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
