import { Container } from './container';

export const Inject = (type: string, name: string, ...args: any): any => {
    const allowedTypes = ['config', 'service', 'handler', 'repository'];

    if (-1 === allowedTypes.indexOf(type)) {
        throw new Error(`${type} is not in ${allowedTypes.join(',')}`);
    }

    return (target: { [key: string]: any }, propertyName: string): void => {
        const container = Container.getInstance();
        const conf = container[type][name];

        if (undefined === conf) {
            throw new Error(`${type} with name: ${name} does not exists`);
        }

        if (undefined !== args) {
            const key = JSON.stringify(args);

            if (undefined === conf.children[key]) {
                conf.children[key] = new conf.target(args);
            }

            target[propertyName] = conf.children[key];
        } else {
            if (undefined === conf.instance) {
                conf.instance = new conf.target();
            }
            target[propertyName] = conf.instance;
        }
    };
};
