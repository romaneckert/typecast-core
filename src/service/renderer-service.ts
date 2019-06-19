import * as nodePath from 'path';
import * as pug from 'pug';
import { ContainerAware } from '../core/container-aware';

export class RendererService extends ContainerAware {
    private templates: { [key: string]: any } = {};

    public async start() {
        for (const applicationPath of this.container.config.application.applicationPaths) {
            const viewPath = nodePath.join(applicationPath, 'view/template');

            if (await this.container.service.fs.isDirectory(viewPath)) {
                await this.compileTemplates(viewPath);
            }
        }
    }

    public async render(filePath: string, locals: { [key: string]: any }, callback: (val: any, template: any) => void) {
        if ('function' !== typeof this.templates[filePath]) {
            throw new Error(`template ${filePath} does not exists`);
        }

        if ('string' !== typeof locals.locale || 0 === locals.locale.length) {
            locals.locale = null;
        }

        locals.view = {};

        for (const [key, value] of Object.entries(this.container.config.server.viewHelper)) {
            locals.view[key] = value.render.bind(value);
        }

        callback(null, this.templates[filePath](locals, { cache: true }));
    }

    private async compileTemplates(path: string) {
        if (await this.container.service.fs.isDirectory(path)) {
            for (const fileName of await this.container.service.fs.readDirectory(path)) {
                await this.compileTemplates(nodePath.join(path, fileName));
            }
        } else if (await this.container.service.fs.isFile(path)) {
            this.templates[path] = pug.compileFile(path, {
                filename: path,
            });
        }
    }
}
