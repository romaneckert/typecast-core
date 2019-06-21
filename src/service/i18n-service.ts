import * as nodePath from 'path';
import { Component } from '../core/component';
import { Inject } from '../core/inject';
import { IApplicationConfig } from '../interface/config/application-config-interface';
import { II18nConfig } from '../interface/config/i18n-config-interface';
import { IFileSystemService } from '../interface/service/file-system-service-interface';
import { ILoggerService } from '../interface/service/logger-service-interface';

@Component('service', 'i18n')
export class I18nService {
    private catalog: { [key: string]: any } = {};

    @Inject('config', 'application')
    private applicationConfig: IApplicationConfig;

    @Inject('config', 'database')
    private config: II18nConfig;

    @Inject('service', 'logger', 'service', 'i18n')
    private logger: ILoggerService;

    @Inject('service', 'file-service')
    private fileSystem: IFileSystemService;

    public async start() {
        const localePaths = [];

        for (const applicationPath of this.applicationConfig.paths) {
            const localePath = nodePath.join(applicationPath, 'locale');

            if (await this.fileSystem.isDirectory(localePath)) {
                localePaths.push(localePath);
            }
        }

        for (const localePath of localePaths.reverse()) {
            await this.loadLocales(localePath, this.catalog);
        }
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

        if ('string' === typeof translation) {
            return this.addData(locale, key, translation, data);
        }

        if ('string' === typeof translation) {
            this.logger.debug(
                `the translation key '${key}' could not be found for the locale ${locale}, fallback to ${this.config.defaultLocale}`,
            );

            return this.addData(this.config.defaultLocale, key, translation, data);
        }

        this.logger.warning(
            `the translation key '${key}' could not be found for the default locale ${this.config.defaultLocale}`,
        );

        return key;
    }

    private async loadLocales(path: string, catalog: { [key: string]: any }) {
        for (const fileName of await this.fileSystem.readDirectory(path)) {
            const absPath = nodePath.join(path, fileName);

            if ((await this.fileSystem.isFile(absPath)) && '.locale' === nodePath.parse(fileName).ext) {
                catalog[nodePath.parse(fileName).name] = await this.fileSystem.readFile(absPath);
            } else if (await this.fileSystem.isDirectory(absPath)) {
                if (undefined === catalog[fileName]) {
                    catalog[fileName] = {};
                }

                await this.loadLocales(absPath, catalog[fileName]);
            }
        }
    }

    private addData(locale: string, key: string, value: string, data?: { [key: string]: any }): string {
        if (undefined === data) {
            return value;
        }

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
