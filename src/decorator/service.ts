import { Container } from '../core/container';

export const Service = (): ClassDecorator => {
    return target => {
        if (undefined === Container.classes.service) {
            Container.classes.service = [];
        }

        let k = 0;

        for (const option of Container.classes.service) {
            if (option.isPrototypeOf(target)) {
                Container.classes.service[k] = target;
                return;
            }

            k++;
        }

        Container.classes.service.push(target);
    };
};
