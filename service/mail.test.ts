import Application from '../core/application';
import Container from '../core/container';
import MailService from './mail';
import SMTPServerService from './smtp-server';

const app: Application = new Application();

beforeAll(async () => {
    await app.start();
});
afterAll(async () => {
    await app.stop();
});

test('mail', async () => {
    const mail = await Container.get<MailService>(MailService);
    const smtp = await Container.get<SMTPServerService>(SMTPServerService);

    // test html mail
    await mail.send({
        html: '<html><head></head><body>Test Mail</body>',
        subject: 'TYPECAST | Test HTML Mail',
        to: 'test@test',
    });

    // test text mail
    await mail.send({
        subject: 'TYPECAST | Test Text Mail',
        text: 'Text TEXT Mail',
        to: 'test@test',
    });

    // test mail with custom from
    await mail.send({
        from: 'test@test',
        subject: 'TYPECAST | Test Text Mail',
        text: 'Text TEXT Mail',
        to: 'test@test',
    });
});
