import { ContainerAware } from '../core/container-aware';

export class TranslateViewHelper extends ContainerAware {
    public render(locale: string, key: string, data: { [key: string]: any }): string {
        return key; // TODO: load from i18n module
    }
}
