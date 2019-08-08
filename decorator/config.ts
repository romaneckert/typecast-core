import Container from '../core/container';

export default function Config(options?: { [key: string]: any }): ClassDecorator {
    return target => {
        if (undefined === Container.classes.config) {
            Container.classes.config = [];
        }

        let k = 0;
        for (const config of Container.classes.config) {
            if (config.target.isPrototypeOf(target)) {
                Container.classes.config[k] = {
                    options,
                    target,
                };
                return;
            }

            k++;
        }

        Container.classes.config.push({
            options,
            target,
        });
    };
}
