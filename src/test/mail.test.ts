import { Application } from '../../dist/application';
import { Container } from '../../dist/core/container';
import { MailService } from '../../dist/service/mail';
import { ServerService } from '../../dist/service/server';

test('mail', async () => {
    const app = new Application();
    await app.start();

    const mail: MailService = await Container.get(MailService);
    const server: ServerService = await Container.get(ServerService);

    mail.send({
        html: await server.render('mail'),
        subject: 'Test Mail Service',
        to: 'test@jeneric',
    });

    await app.stop();
});
