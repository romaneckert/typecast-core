import Container from '../core/container';

export default function Route(options?: { [key: string]: any }): ClassDecorator {
    return target => {
        if (undefined === Container.classes.route) {
            Container.classes.route = [];
        }

        let k = 0;

        for (const option of Container.classes.route) {
            if (target.isPrototypeOf(option)) {
                Container.classes.route[k] = {
                    options,
                    target,
                };
                return;
            }

            k++;
        }

        Container.classes.route.push({
            options,
            target,
        });
    };
};
