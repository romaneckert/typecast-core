import Container from '../core/container';

export default function Service(options?: { [key: string]: any }): ClassDecorator {
    return target => {
        if (undefined === Container.classes.service) {
            Container.classes.service = [];
        }

        let k = 0;

        for (const service of Container.classes.service) {
            if (service.target.isPrototypeOf(target)) {
                Container.classes.service[k] = {
                    options,
                    target,
                };
                return;
            }

            k++;
        }

        Container.classes.service.push({
            options,
            target,
        });
    };
}
