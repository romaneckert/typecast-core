import { ContainerAware } from '../core/container-aware';

export class UrlViewHelper extends ContainerAware {
    public render(routeName: string, data: { [key: string]: any }): string {
        return 'url'; // TODO: add function
    }
}
