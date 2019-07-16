import * as nodePath from 'path';
import * as pug from 'pug';
import { ApplicationConfig } from '../config/application-config';
import { HTTPServerConfig } from '../config/http-server-config';
import { Container } from '../core/container';
import { Service } from '../decorator/service';
import { FileSystemUtil } from '../util/file-system';

@Service()
export class RendererService {
    private applicationConfig: ApplicationConfig;
    private serverConfig: HTTPServerConfig;
    private templates: { [key: string]: any } = {};

    public constructor(applicationConfig: ApplicationConfig, serverConfig: HTTPServerConfig) {
        this.applicationConfig = applicationConfig;
        this.serverConfig = serverConfig;
    }

    public async start() {
        for (const path of this.applicationConfig.paths) {
            const viewPath = nodePath.join(path, 'view/template');

            if (await FileSystemUtil.isDirectory(viewPath)) {
                await this.compileTemplates(viewPath);
            }
        }
    }

    public async render(filePath: string, locals: { [key: string]: any }, callback: (val: any, template: any) => void): Promise<void> {
        if ('function' !== typeof this.templates[filePath]) {
            throw new Error(`template ${filePath} does not exists`);
        }

        if ('string' !== typeof locals.locale || 0 === locals.locale.length) {
            locals.locale = null;
        }

        locals.view = {};

        for (const viewHelper of Object.values(await Container.getViewHelpers())) {
            let viewHelperName = viewHelper.constructor.name.replace('ViewHelper', '');
            viewHelperName = viewHelperName.charAt(0).toLowerCase() + viewHelperName.slice(1);

            locals.view[viewHelperName] = viewHelper.render.bind(viewHelper);
        }

        callback(null, this.templates[filePath](locals, { cache: true }));
    }

    private async compileTemplates(path: string) {
        if (await FileSystemUtil.isDirectory(path)) {
            for (const fileName of await FileSystemUtil.readDirectory(path)) {
                await this.compileTemplates(nodePath.join(path, fileName));
            }
        } else if (await FileSystemUtil.isFile(path)) {
            this.templates[path] = pug.compileFile(path, {
                filename: path,
            });
        }
    }
}
