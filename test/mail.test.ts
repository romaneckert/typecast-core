import { SMTPServer } from 'smtp-server';
import nodemailer from 'nodemailer';
import http from 'http';

const smtpServer = new SMTPServer({
    authOptional: true,
});

const httpServer = http.createServer((req, res) => {
    res.write('Hello World!');
    res.end();
});

let transporter: any;

beforeAll(async () => {
    httpServer.listen(8080);

    await new Promise(resolve => {
        smtpServer.listen(3030, 'localhost', resolve);
    });

    transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 3030,
        tls: {
            rejectUnauthorized: false,
        },
    });
});

afterAll(async () => {
    await new Promise(resolve => {
        smtpServer.close(resolve);
    });

    await new Promise(resolve => {
        httpServer.close(resolve);
    });
});

describe('service', () => {
    test('mail', async () => {
        const info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            html: '<b>Hello world?</b>', // html body
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            to: 'bar@example.com, baz@example.com', // list of receivers
        });
    });

    test('mail2', async () => {
        const info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            html: '<b>Hello world?</b>', // html body
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            to: 'bar@example.com, baz@example.com', // list of receivers
        });
    });
});
