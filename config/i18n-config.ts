import { Config } from '../decorator/config';

@Config()
// TODO: use getter for validation
export class I18nConfig {
    public locales: string[] = ['en', 'de'];
    public defaultLocale: string = 'en';

    public validate() {
        if (0 === this.locales.length) {
            throw new Error(`locales not set or not valid - have to be array of strings - example: ['en', 'de']`);
        }

        if ('string' !== typeof this.defaultLocale || 0 === this.defaultLocale.length) {
            throw new Error(`defaultLocale not set or not valid - have to be string - example: 'en'`);
        }
    }
}
