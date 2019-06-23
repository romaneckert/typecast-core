import { Container } from '../core/container';

export const Middleware = (): ClassDecorator => {
    return target => {
        if (undefined === Container.classes.middleware) {
            Container.classes.middleware = [];
        }

        let k = 0;

        for (const option of Container.classes.middleware) {
            if (option.isPrototypeOf(target)) {
                Container.classes.middleware[k] = target;
                return;
            }

            k++;
        }

        Container.classes.middleware.push(target);
    };
};
