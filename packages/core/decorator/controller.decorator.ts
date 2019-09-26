import ApplicationService from '../service/application.service';

export default function ControllerDecorator(): ClassDecorator {
    return target => {
        ApplicationService.registerClass(target);
    };
}
