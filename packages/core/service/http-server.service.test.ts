/* tslint:disable:no-empty */

import https from 'https';
import ApplicationService from './application.service';
import HTTPServerService from './http-server.service';

test('http-service', async () => {
    // try to create test server to block port 80
    try {
        await new Promise((resolve, reject) => {
            https
                .createServer()
                .listen({ port: 80 }, () => {
                    resolve();
                })
                .on('error', reject);
        });
    } catch (err) {}

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
