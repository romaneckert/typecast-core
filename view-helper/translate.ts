import { ViewHelper } from '../decorator/view-helper';
import IViewHelper from '../interface/view-helper';
import I18nService from '../service/i18n';

@ViewHelper()
export class TranslateViewHelper implements IViewHelper {
    private i18n: I18nService;

    public constructor(i18n: I18nService) {
        this.i18n = i18n;
    }

    public render(locale: string, key: string, data: { [key: string]: any }): string {
        return this.i18n.translate(locale, key, data);
    }
}
