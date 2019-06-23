import { Container } from '../core/container';

export const ViewHelper = (): ClassDecorator => {
    return target => {
        if (undefined === Container.classes.viewHelper) {
            Container.classes.viewHelper = [];
        }

        let k = 0;

        for (const option of Container.classes.viewHelper) {
            if (option.isPrototypeOf(target)) {
                Container.classes.viewHelper[k] = target;
                return;
            }

            k++;
        }

        Container.classes.viewHelper.push(target);
    };
};
