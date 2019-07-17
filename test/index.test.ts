import axios from 'axios';
import url from 'url';
import * as nodePath from 'path';
import { Application } from '../core/application';
import { HTTPServerConfig } from '../config/http-server-config';
import { Container } from '../core/container';
import { I18nService } from '../service/i18n';
import { LoggerService } from '../service/logger';
import { MailService } from '../service/mail';
import { FileSystemUtil } from '../util/file-system';
import { StringUtil } from '../util/string';
import { ApplicationConfig } from '../config/application-config';
import { DatabaseService } from '../service/database';
import { SMTPServerService } from '../service/smtp-server';
import { SMTPServerConfig } from '../config/smtp-server-config';

const app: Application = new Application();
let database: DatabaseService;

beforeAll(async () => {
    await app.start();
    database = await Container.get<DatabaseService>(DatabaseService);
});
afterAll(async () => {
    await app.stop();
});

describe('config', () => {
    test('smtp-server', async () => {
        const smtpServerConfig = await Container.get<SMTPServerConfig>(SMTPServerConfig);
    });
});

describe('service', () => {
    test('i18n', async () => {
        const i18n = await Container.get<I18nService>(I18nService);

        expect(await i18n.translate('en', 'application.title')).toBe('TYPECAST');
        expect(await i18n.translate('de', 'application.title')).toBe('TYPECAST');
        expect(await i18n.translate('es', 'application.title')).toBe('TYPECAST');

        expect(await i18n.translate('en', 'typecast.error.error_message', { message: 'This is a test message.' })).toBe('An error has occurred with the following message: This is a test message.');
        expect(await i18n.translate('de', 'typecast.error.error_message', { message: 'Das ist eine Test Nachricht.' })).toBe(
            'Es ist ein Fehler mit folgender Nachricht aufgetreten: Das ist eine Test Nachricht.',
        );
        expect(await i18n.translate('en', 'typecast.error.error_message')).toBe('An error has occurred with the following message: UNDEFINED');
        expect(await i18n.translate('en', 'typecast.error.error_message', {})).toBe('An error has occurred with the following message: UNDEFINED');
        expect(await i18n.translate('fr', 'typecast.error.error_message', {})).toBe('An error has occurred with the following message: UNDEFINED');

        // test invalid key
        expect(await i18n.translate('en', 'typecast  asdf 12!!')).toBe('typecast  asdf 12!!');

        // test not existing keys
        expect(await i18n.translate('en', 'not.existing.key')).toBe('not.existing.key');

        // test empty key
        expect(await i18n.translate('en', '')).toBe('');
    });

    test('logger', async () => {
        const logger = await Container.get<LoggerService>(LoggerService);
        logger.contextType = 'test';
        logger.contextName = 'test';

        await logger.alert('alert message');
        await logger.critical('critical message');
        await logger.debug('debug message');
        await logger.emergency('emergency message');
        await logger.error('error message');
        await logger.info('info message');
        await logger.notice('notice message');
        await logger.warning('warning message');

        await logger.removeAllLogFiles();
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
});
describe('util', () => {
    describe('file-system', () => {
        test('remove', async () => {
            const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
            const pathToTestFile = nodePath.join(applicationConfig.rootPath, 'var/test/file-system/remove.txt');
            await FileSystemUtil.ensureFileExists(pathToTestFile);
            expect(await FileSystemUtil.isFile(pathToTestFile)).toBe(true);
            await FileSystemUtil.remove(pathToTestFile);
            expect(await FileSystemUtil.isFile(pathToTestFile)).toBe(false);
        });
        test('isFile', async () => {
            const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
            const pathToTestFile = nodePath.join(applicationConfig.rootPath, 'var/test/file-system/isFile.txt');
            await FileSystemUtil.ensureFileExists(pathToTestFile);
            expect(await FileSystemUtil.isFile(pathToTestFile)).toBe(true);
            await FileSystemUtil.remove(pathToTestFile);
            expect(await FileSystemUtil.isFile(pathToTestFile)).toBe(false);
        });

        test('isFileSync', async () => {
            const applicationConfig = await Container.get<ApplicationConfig>(ApplicationConfig);
            const pathToTestFile = nodePath.join(applicationConfig.rootPath, 'var/test/file-system/isFile.txt');
            await FileSystemUtil.ensureFileExists(pathToTestFile);
            expect(FileSystemUtil.isFileSync(pathToTestFile)).toBe(true);
            await FileSystemUtil.remove(pathToTestFile);
            expect(FileSystemUtil.isFileSync(pathToTestFile)).toBe(false);
        });
    });
    describe('string', () => {
        test('cast', () => {
            expect(StringUtil.cast(null)).toBe('null');
            expect(StringUtil.cast(undefined)).toBe('undefined');
            expect(StringUtil.cast({ t: 'test' })).toBe('{"t":"test"}');
            expect(StringUtil.cast([1, 2, 3, 4, {}])).toBe('[1,2,3,4,{}]');
            expect(StringUtil.cast(new Error('test'))).toBe('Error: test');
            expect(StringUtil.cast(new TypeError('test'))).toBe('TypeError: test');
            expect(StringUtil.cast('a string')).toBe('a string');

            expect(StringUtil.cast({ a: 'string' })).toBe('{"a":"string"}');

            // TODO: optimize
            const a: { [key: string]: any } = {};
            const b: { [key: string]: any } = {};

            a.b = b;
            b.a = a;

            expect(StringUtil.cast(a)).toBe('{"b":{}}');
        });
        test('camelize', () => {
            expect(StringUtil.camelize('camelized-string')).toBe('camelizedString');
            expect(StringUtil.camelize('camelized   string')).toBe('camelizedString');
            expect(StringUtil.camelize('super Camelized   string')).toBe('superCamelizedString');
            expect(StringUtil.camelize('super Camelized2   string')).toBe('superCamelized2String');
            expect(StringUtil.camelize('super_camelized_string')).toBe('superCamelizedString');
            expect(StringUtil.camelize('super.camelized.string')).toBe('superCamelizedString');
            expect(StringUtil.camelize('camelized')).toBe('camelized');
            expect(StringUtil.camelize('Camelized')).toBe('camelized');
        });
        test('decamelize', () => {
            expect(StringUtil.decamelize('camelized-string')).toBe('camelized-string');
            expect(StringUtil.decamelize('CamelizedString')).toBe('camelized-string');
            expect(StringUtil.decamelize('camelizedString')).toBe('camelized-string');
            expect(StringUtil.decamelize(' CamelizedString')).toBe('camelized-string');
            expect(StringUtil.decamelize(' camelized   String')).toBe('camelized-string');
            expect(StringUtil.decamelize('1CamelizedString')).toBe('1-camelized-string');
        });
    });
});
describe('middleware', () => {
    test('not-found', async () => {
        const httpServerConfig = await Container.get<HTTPServerConfig>(HTTPServerConfig);

        try {
            await axios.get(url.resolve(httpServerConfig.baseUrl, 'path-that-does-not-exists'));
        } catch (err) {
            expect(err.response.status).toBe(404);
            expect(err.response.data.includes('<body>404</body>')).toBe(true);
        }

        try {
            await axios.get(url.resolve(httpServerConfig.baseUrl, 'path-that-does-not-exists'), { headers: { 'Content-Type': 'application/json' } });
        } catch (err) {
            expect(err.response.status).toBe(404);
            expect(err.response.data.status).toBe(404);
        }
    });
});
describe('route', () => {
    test('/', async () => {
        const httpServerConfig = await Container.get<HTTPServerConfig>(HTTPServerConfig);
        const response = await axios.get(httpServerConfig.baseUrl);
        expect(response.data.includes('Welcome to Typecast')).toBe(true);
    });
});
describe('process', () => {
    test('setup project', async () => {
        // delete database to have a clean setup
        await database.drop();

        const httpServerConfig = await Container.get<HTTPServerConfig>(HTTPServerConfig);
        const response = await axios.post(url.resolve(httpServerConfig.baseUrl, 'typecast/install'), { email: 'test@test.typecast' });
        expect(response.data.includes('Please create your password')).toBe(true);
        expect(response.data.includes('Click on the link in the email you received')).toBe(true);
    });
});
