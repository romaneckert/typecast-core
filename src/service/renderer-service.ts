import * as nodePath from 'path';
import * as pug from 'pug';
import { ContainerAware } from '../core/container-aware';

/**
 * TODO: optimize
 */
export class RendererService extends ContainerAware {
    private templates: { [key: string]: any } = {};

    public async start() {
        const viewPaths = [];

        for (const viewPath of this.container.config.server.viewPaths.reverse()) {
            viewPaths.push(nodePath.join(this.container.config.application.basePath, viewPath));
        }

        for (const path of viewPaths) {
            await this.compileTemplates(path);
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
