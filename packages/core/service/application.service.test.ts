import ApplicationService from './application.service';
import CoreModule from '../core.module';

describe('service', () => {
    test('application', async () => {
        const core = await ApplicationService.create<CoreModule>(CoreModule);

        expect(await core.start()).toBe(true);
        expect(await core.start()).toBe(false);
        expect(await core.stop()).toBe(true);
        expect(await core.stop()).toBe(false);
        expect(await core.start()).toBe(true);
        expect(await core.stop()).toBe(true);
    });
});
