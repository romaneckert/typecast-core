import Container from '../core/container';

export default function Route(options: {
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

        for (const option of Container.classes.route) {
            if (option.target.isPrototypeOf(target)) {
                Container.classes.route[k] = {
                    options,
                    target,
                };
                return;
            }

            k++;
        }

        Container.classes.route.push({
            options,
            target,
        });
    };
}
