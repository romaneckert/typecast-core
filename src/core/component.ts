import { Container } from './container';

export const Component = (type: string, name: string): ClassDecorator => {
    const allowedTypes = ['config', 'service', 'repository'];

    if (-1 === allowedTypes.indexOf(type)) {
        throw new Error(`${type} not config, service or repository`);
    }

    if (undefined === Container.getInstance()[type]) {
        Container.getInstance()[type] = {};
    }

    return (target: any) => {
        Container.getInstance()[type][name] = {
            children: {},
            instance: undefined,
            target,
        };
    };
};
