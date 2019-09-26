import ApplicationService from "../service/application.service";

export default function ServiceDecorator(): ClassDecorator {
    return target => {
        ApplicationService.registerClass(target);
    };
}
