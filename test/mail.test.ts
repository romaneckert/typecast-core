import { Application } from '../src/application';

test('mail', async () => {
    const app = new Application();
    await app.start();

    app.container.service.mail.send({
        html: await app.container.service.server.render('mail'),
        subject: 'Test Mail Service',
        to: 'test@jeneric',
    });

    await app.stop();
});
