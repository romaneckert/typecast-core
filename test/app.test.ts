import { Server } from '../src/service/server';

test('server', () => {

    let server = new Server();

    expect(server.start()).toBe(undefined);
});