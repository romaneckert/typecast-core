import express from 'express';
import { I18nConfig } from '../config/i18n-config';
import { Middleware } from '../decorator/middleware';
import { IMiddleware } from '../interface/middleware';

@Middleware()
export class LocaleMiddleware implements IMiddleware {
    private i18nConfig: I18nConfig;

    public constructor(i18nConfig: I18nConfig) {
        this.i18nConfig = i18nConfig;
    }

    public async handle(req: express.Request, res: express.Response, next: () => void) {
        let locale = null;

        // try to get locale from request query parameter
        if (-1 !== this.i18nConfig.locales.indexOf(req.query._locale)) {
            locale = req.query._locale;
        }

        // try to get locale from browser if query parameter not set
        if (null === locale) {
            const browserLanguage = req.acceptsLanguages(...this.i18nConfig.locales);

            if ('string' === typeof browserLanguage) {
                locale = browserLanguage;
            }
        }

        // set default locale
        if (!this.i18nConfig.locales.includes(locale)) {
            locale = this.i18nConfig.defaultLocale;
        }

        res.locals.locale = locale;

        return next();
    }
}
