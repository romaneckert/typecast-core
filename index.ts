import ApplicationService from './packages/core/service/application.service';
import CoreModule from './packages/core/core.module';

(async () => {
    const core = await ApplicationService.create<CoreModule>(CoreModule);
    await core.start();
})();
