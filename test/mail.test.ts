import { SMTPServer } from 'smtp-server';
import nodemailer from 'nodemailer';

test('mail', async () => {
    const server = new SMTPServer({
        authOptional: true,
    });

    await new Promise((reject: any, resolve: any) => {
        server.listen(3030, 'localhost', reject);
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

    console.log(info);

    await new Promise((reject: any, resolve: any) => {
        server.close(reject);
    });
});
