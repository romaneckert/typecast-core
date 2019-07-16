import { SMTPServer } from 'smtp-server';
import nodemailer from 'nodemailer';

test('mail', async () => {
    const server = new SMTPServer({
        authOptional: true,
    });

    await new Promise((resolve: any, reject: any) => {
        server.listen(3030, 'localhost', resolve);
    });

    const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 3030,
        tls: {
            rejectUnauthorized: false,
        },
    });

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'bar@example.com, baz@example.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>', // html body
    });

    await new Promise((resolve: any, reject: any) => {
        server.close(resolve);
    });
});
