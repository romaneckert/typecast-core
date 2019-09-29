import ApplicationService from '../service/application.service';

export default function ConfigDecorator(): ClassDecorator {
    return target => {
        ApplicationService.registerClass(target, 'config');
    };
}
