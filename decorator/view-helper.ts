import Container from '../core/container';

export default function ViewHelper(options?: { [key: string]: any }): ClassDecorator {
    return target => {
        if (undefined === Container.classes.viewHelper) {
            Container.classes.viewHelper = [];
        }

        let k = 0;

        for (const option of Container.classes.viewHelper) {
            if (option.isPrototypeOf(target)) {
                Container.classes.viewHelper[k] = {
                    options,
                    target,
                };
                return;
            }

            k++;
        }

        Container.classes.viewHelper.push({
            options,
            target,
        });
    };
}
