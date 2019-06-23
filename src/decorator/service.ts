import { Container } from '../core/container';

export const Service = (): ClassDecorator => {
    return target => {
        let k = 0;

        for (const option of Container.service) {
            if (option.isPrototypeOf(target)) {
                Container.service[k] = target;
                return;
            }

            k++;
        }

        Container.service.push(target);
    };
};
