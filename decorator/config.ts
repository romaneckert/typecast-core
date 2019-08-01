import Container from '../core/container';

export default function Config(options?: { [key: string]: any }): ClassDecorator {
    return target => {
        if (undefined === Container.classes.config) {
            Container.classes.config = [];
        }

        let k = 0;
        for (const option of Container.classes.config) {
            if (target.isPrototypeOf(option.target)) {
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
