import { Container } from '../core/container';

export const Route = (): ClassDecorator => {
    return target => {
        let k = 0;

        for (const option of Container.route) {
            if (option.isPrototypeOf(target)) {
                Container.route[k] = target;
                return;
            }

            k++;
        }

        Container.route.push(target);
    };
};
