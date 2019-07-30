import * as nodePath from 'path';
import ApplicationConfig from '../config/application-config';
import { ViewHelper } from '../decorator/view-helper';
import { IViewHelper } from '../interface/view-helper';

@ViewHelper()
export class AssetViewHelper implements IViewHelper {
    private applicationConfig: ApplicationConfig;

    public constructor(applicationConfig: ApplicationConfig) {
        this.applicationConfig = applicationConfig;
    }

    public render(src: string): string {
        return nodePath.join('/assets/', src) + '?' + this.applicationConfig.buildDate.getTime();
    }
}
