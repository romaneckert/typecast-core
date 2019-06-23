import { Container } from '../core/container';

export const Config = (): ClassDecorator => {
    return target => {
        if (undefined === Container.classes.config) {
            Container.classes.config = [];
        }

        let k = 0;
        for (const option of Container.classes.config) {
            if (option.isPrototypeOf(target)) {
                Container.classes.config[k] = target;
                return;
            }

            k++;
        }

        Container.classes.config.push(target);
    };
};
