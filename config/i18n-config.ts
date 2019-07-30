import { Config } from '../decorator/config';

@Config()
export class I18nConfig {
    public locales: string[] = ['en', 'de'];
    public defaultLocale: string = 'en';
}
