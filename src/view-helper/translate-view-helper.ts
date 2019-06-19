import { ContainerAware } from '../core/container-aware';

export class TranslateViewHelper extends ContainerAware {
    public render(locale: string, key: string, data: { [key: string]: any }): string {
        return this.container.service.i18n.translate(locale, key, data);
    }
}
