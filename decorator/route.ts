import Container from '../core/container';

export default function Route(options?: {
    name: string;
    methods: string[];
    path: string;
    roles?: string[];
    backend?: {
        module?: {
            mainKey?: string;
            subKey?: string;
            titleKey?: string;
        };
    };
    disabled?: boolean;
    openapi?: any;
}): ClassDecorator {
    return target => {
        if (undefined === Container.classes.route) {
            Container.classes.route = [];
        }

        let k = 0;
        let prototypeFound = false;

        for (const route of Container.classes.route) {
            if (route.target.isPrototypeOf(target)) {
                if (undefined === options) {
                    options = route.options;
                }

                Container.classes.route[k] = {
                    options,
                    target,
                };

                prototypeFound = true;
                break;
            }

            k++;
        }

        if (!prototypeFound) {
            Container.classes.route.push({
                options,
                target,
            });
        }

        for (const route of Container.classes.route) {
            if (undefined === route.options) {
                throw new Error('route options empty');
            }
        }
    };
}
