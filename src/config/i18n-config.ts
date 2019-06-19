import { IConfig } from '../interface/config-interface';

export class I18nConfig implements IConfig {
    public locales: string[] = ['en'];
    public defaultLocale: string = 'en';

    public validate() {
        return;
    }
}
