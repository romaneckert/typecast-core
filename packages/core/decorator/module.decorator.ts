import ApplicationService from "../service/application.service";

export default function ModuleDecorator(options?: { controllers?: any[]; services?: any[] }): ClassDecorator {
    return target => {
        ApplicationService.registerClass(target);
    };
}
