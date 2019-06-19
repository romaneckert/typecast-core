import * as nodePath from 'path';
import { Container } from '../container';
import { ContainerAware } from '../core/container-aware';
import { ILogger } from '../interface/logger-interface';
import { LoggerService } from './logger-service';

export class I18nService extends ContainerAware {
    private catalog: { [key: string]: any } = {};
    private logger: ILogger;

    constructor(container: Container) {
        super(container);
        this.logger = new LoggerService(container, 'service', 'i18n');
    }

    public async start() {
        const localePaths = [];

        for (const localePath of this.container.config.i18n.localePaths) {
            localePaths.push(nodePath.join(this.container.config.application.basePath, localePath));
        }

        for (const localePath of localePaths) {
            await this.loadLocales(localePath, this.catalog);
        }
    }

    public translate(locale: string, key: string, data: { [key: string]: any }) {
        // check if locale is in the list of predefined locales, if not fall back to default locale
        if (-1 === this.container.config.i18n.locales.indexOf(locale)) {
            locale = this.container.config.i18n.defaultLocale;
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

        if ('string' === typeof translation) {
            return this.addData(locale, key, translation, data);
        }

        if ('string' === typeof translation) {
            this.logger.debug(
                `the translation key '${key}' could not be found for the locale ${locale}, fallback to ${this.container.config.i18n.defaultLocale}`,
            );

            return this.addData(this.container.config.i18n.defaultLocale, key, translation, data);
        }

        this.logger.warning(
            `the translation key '${key}' could not be found for the default locale ${this.container.config.i18n.defaultLocale}`,
        );

        return key;
    }

    private async loadLocales(path: string, catalog: { [key: string]: any }) {
        for (const fileName of await this.container.service.fs.readDirectory(path)) {
            const absPath = nodePath.join(path, fileName);

            if (await this.container.service.fs.isFile(absPath)) {
                catalog[nodePath.parse(fileName).name] = await this.container.service.fs.readFile(absPath);
            } else if (await this.container.service.fs.isDirectory(absPath)) {
                if (undefined === catalog[fileName]) {
                    catalog[fileName] = {};
                }

                await this.loadLocales(absPath, catalog[fileName]);
            }
        }
    }

    private addData(locale: string, key: string, value: string, data: { [key: string]: any }) {
        return value.replace(/{{(.+?)}}/g, match => {
            const property = match
                .replace('{{', '')
                .replace('}}', '')
                .trim();

            if ('string' === typeof data[property]) {
                return data[property];
            }

            this.logger.warning(`the translation key '${key}' in locale ${locale} has no data for ${match}`);

            return match;
        });
    }
}
