import * as nodePath from 'path';
import { ApplicationConfig } from '../config/application-config';
import { ViewHelper } from '../decorator/view-helper';

@ViewHelper()
export class AssetViewHelper {
    private applicationConfig: ApplicationConfig;

    public constructor(applicationConfig: ApplicationConfig) {
        this.applicationConfig = applicationConfig;
    }

    public render(src: string): string {
        return nodePath.join('/assets/', src) + '?' + this.applicationConfig.buildDate.getTime();
    }
}
