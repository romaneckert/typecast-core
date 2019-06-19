import express from 'express';
import { ContainerAware } from '../core/container-aware';
import { IMiddleware } from '../interface/middleware-interface';

export class LocaleMiddleware extends ContainerAware implements IMiddleware {
    public async handle(req: express.Request, res: express.Response, next: () => void) {
        let locale = null;

        // try to get locale from request query parameter
        if (-1 !== this.container.config.i18n.locales.indexOf(req.query._locale)) {
            locale = req.query._locale;
        }

        // try to get locale from browser if query parameter not set
        if (null === locale) {
            const browserLanguage = req.acceptsLanguages(...this.container.config.i18n.locales);

            if ('string' === typeof browserLanguage) {
                locale = browserLanguage;
            }
        }

        res.locals.locale = locale;

        return next();
    }
}
