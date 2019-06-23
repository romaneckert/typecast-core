import { Container } from '../core/container';

export const Middleware = (): ClassDecorator => {
    return target => {
        let k = 0;

        for (const option of Container.middleware) {
            if (option.isPrototypeOf(target)) {
                Container.middleware[k] = target;
                return;
            }

            k++;
        }

        Container.middleware.push(target);
    };
};
