import * as nodePath from 'path';
import { ContainerAware } from '../core/container-aware';

export class AssetViewHelper extends ContainerAware {
    public render(src: string): string {
        return nodePath.join('/assets/', src) + '?' + this.container.config.application.buildDate.getTime();
    }
}
