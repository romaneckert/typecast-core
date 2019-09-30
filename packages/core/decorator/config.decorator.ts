import ApplicationService from '../service/application.service';
import EnvironmentUtil from '../util/environment.util';

export default function ConfigDecorator(config: Array<[string, string | string[] | number | number[] | boolean, boolean]>): ClassDecorator {
    return target => {
        for (const variableConfig of config) {
            EnvironmentUtil.registerVariable(variableConfig[0], variableConfig[1], variableConfig[2]);
        }

        ApplicationService.registerClass(target, 'config');
    };
}
