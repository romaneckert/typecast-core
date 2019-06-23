import { Container } from '../core/container';

export const Route = (): ClassDecorator => {
    return target => {
        if (undefined === Container.classes.route) {
            Container.classes.route = [];
        }

        let k = 0;

        for (const option of Container.classes.route) {
            if (option.isPrototypeOf(target)) {
                Container.classes.route[k] = target;
                return;
            }

            k++;
        }

        Container.classes.route.push(target);
    };
};
