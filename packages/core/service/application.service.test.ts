/* tslint:disable:max-classes-per-file */

import ApplicationService from './application.service';
import CoreModule from '../core.module';
import ServiceDecorator from '../decorator/service.decorator';

class TestServiceWithoutDecorator {}

@ServiceDecorator()
class Test1Service {}

@ServiceDecorator()
class Test2Service extends Test1Service {}

@ServiceDecorator()
class Test3Service extends Test2Service {}

test('application', async () => {
    const core = await ApplicationService.create<CoreModule>(CoreModule);

    // test inheritence
    expect((await ApplicationService.create<Test2Service>(Test2Service)) instanceof Test3Service).toBe(true);

    // test not allowed registerClass after first create
    try {
        ApplicationService.registerClass(TestServiceWithoutDecorator);
    } catch (e) {
        expect(e.message).toBe('registerClass() not allowed after create() call');
    }

    // test create not registered class
    try {
        await ApplicationService.create<TestServiceWithoutDecorator>(TestServiceWithoutDecorator);
    } catch (e) {
        expect(e.message).toBe('class is not registered');
    }

    expect(Object.keys(ApplicationService.classes).length).toBeGreaterThan(0);
    expect(Object.keys(ApplicationService.instances).length).toBeGreaterThan(0);

    expect(await core.start()).toBe(true);
    expect(await core.stop()).toBe(true);
});
