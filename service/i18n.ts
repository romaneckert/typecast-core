import * as nodePath from 'path';
import ApplicationConfig from '../config/application-config';
import { I18nConfig } from '../config/i18n-config';
import { ValidationError } from '../core/validation-error';
import { Service } from '../decorator/service';
import FileSystemUtil from '../util/file-system';
import { LoggerService } from './logger';

// TODO: allow key.key1 and key.key1.key2
@Service()
export default class I18nService {
    private catalog: { [key: string]: any } = {};

    private applicationConfig: ApplicationConfig;
    private config: I18nConfig;
    private logger: LoggerService;

    public constructor(config: I18nConfig, applicationConfig: ApplicationConfig, logger: LoggerService) {
        this.config = config;
        this.applicationConfig = applicationConfig;
        this.logger = logger;
    }

    public async start() {
        const localePaths = [];

        for (const applicationPath of this.applicationConfig.paths) {
            const localePath = nodePath.join(applicationPath, 'locale');

            if (await FileSystemUtil.isDirectory(localePath)) {
                localePaths.push(localePath);
            }
        }

        for (const localePath of localePaths) {
            await this.loadLocales(localePath, this.catalog);
        }
    }

    public translateErrors(locale: string, errors: { [key: string]: ValidationError } | null): { [key: string]: any } | null {
        if (null === errors) {
            return null;
        }

        const translatedErrors: { [key: string]: any } = {};

        for (const [key, error] of Object.entries(errors)) {
            translatedErrors[key] = {
                errors: {},
                property: error.property,
            };

            for (const [key2, error2] of Object.entries(error.errors)) {
                translatedErrors[key].errors[key2] = this.translate(locale, error2);
            }
        }

        return translatedErrors;
    }

    public translate(locale: string, key: string, data?: { [key: string]: any }) {
        // check if locale is in the list of predefined locales, if not fall back to default locale
        if (-1 === this.config.locales.indexOf(locale)) {
            locale = this.config.defaultLocale;
        }

        if ('string' !== typeof key || 0 === key.length) {
            this.logger.warning(`an empty key is not allowed`);
            return '';
        }

        // check if the key is valid
        if (0 < key.replace(/[a-zA-Z0-9._]/g, '').length) {
            this.logger.warning(`the translation key '${key}' does not seem to be valid`);
            return key;
        }

        let translation = null;

        // get translation for correct locale
        try {
            translation = key.split('.').reduce((o, i) => o[i], this.catalog[locale]);
        } catch (err) {
            translation = null;
        }

        if ('string' !== typeof translation) {
            this.logger.debug(`the translation key '${key}' could not be found for the locale ${locale}, fallback to ${this.config.defaultLocale}`);

            // get translation for correct locale
            try {
                translation = key.split('.').reduce((o, i) => o[i], this.catalog[this.config.defaultLocale]);
            } catch (err) {
                translation = null;
            }
        }

        if ('string' === typeof translation) {
            return this.addData(locale, key, translation, data);
        }

        this.logger.warning(`the translation key '${key}' could not be found for the default locale ${this.config.defaultLocale}`);

        return key;
    }

    private async loadLocales(path: string, catalog: { [key: string]: any }) {
        for (const fileName of await FileSystemUtil.readDirectory(path)) {
            const absPath = nodePath.join(path, fileName);

            if ((await FileSystemUtil.isFile(absPath)) && '.locale' === nodePath.parse(fileName).ext) {
                catalog[nodePath.parse(fileName).name] = await FileSystemUtil.readFile(absPath);
            } else if (await FileSystemUtil.isDirectory(absPath)) {
                if (undefined === catalog[fileName]) {
                    catalog[fileName] = {};
                }

                await this.loadLocales(absPath, catalog[fileName]);
            }
        }
    }

    private addData(locale: string, key: string, value: string, data?: { [key: string]: any }): string {
        return value.replace(/{{(.+?)}}/g, match => {
            const property = match
                .replace('{{', '')
                .replace('}}', '')
                .trim();

            if ('object' === typeof data && 'string' === typeof data[property]) {
                return data[property];
            }

            this.logger.warning(`the translation key '${key}' in locale ${locale} has no data for ${match}`);

            return 'UNDEFINED';
        });
    }
}
