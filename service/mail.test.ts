import { MailConfig } from '../config/mail-config';
import { Application } from '../core/application';
import { Container } from '../core/container';
import { MailService } from './mail';

test('service/mail', async () => {
    const app = new Application();
    await app.start();

    const mail = await Container.get<MailService>(MailService);
    const mailConfig = await Container.get<MailConfig>(MailConfig);

    // test html mail
    await mail.send({
        html: '<html><head></head><body>Test Mail</body>',
        subject: 'TYPECAST | Test HTML Mail',
        to: mailConfig.defaultFrom,
    });

    // test text mail
    await mail.send({
        subject: 'TYPECAST | Test Text Mail',
        text: 'Text TEXT Mail',
        to: mailConfig.defaultFrom,
    });

    // test mail with custom from
    await mail.send({
        from: mailConfig.defaultFrom,
        subject: 'TYPECAST | Test Text Mail',
        text: 'Text TEXT Mail',
        to: mailConfig.defaultFrom,
    });

    await app.stop();
});
