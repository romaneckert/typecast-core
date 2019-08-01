import Application from '../application';
import I18nService from './i18n';
import Container from '../core/container';

const app: Application = new Application();

beforeAll(async () => {
    await app.start();
});
afterAll(async () => {
    await app.stop();
});

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
