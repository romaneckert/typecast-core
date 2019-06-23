import { Container } from '../core/container';

export const Config = (): ClassDecorator => {
    return target => {
        let k = 0;

        for (const option of Container.config) {
            if (option.isPrototypeOf(target)) {
                Container.config[k] = target;
                return;
            }

            k++;
        }

        Container.config.push(target);
    };
};
