import { Container } from '../core/container';

export const ViewHelper = (): ClassDecorator => {
    return target => {
        let k = 0;

        for (const option of Container.viewHelper) {
            if (option.isPrototypeOf(target)) {
                Container.viewHelper[k] = target;
                return;
            }

            k++;
        }

        Container.viewHelper.push(target);
    };
};
