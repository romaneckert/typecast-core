import EnvironmentVariable from './environment.util';

test('get', async () => {
    return;

    /*
    process.env.TEST_ENVIRONMENT_VARIABLE = '42';
    expect(await EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', '23')).toBe('42');

    process.env.TEST_ENVIRONMENT_VARIABLE = 'test';
    expect(await EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', 'a test string')).toBe('test');

    delete process.env.TEST_ENVIRONMENT_VARIABLE;

    try {
        await EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', '42');
    } catch (err) {
        expect(err.message).toBe('TEST_ENVIRONMENT_VARIABLE not set or not valid - example: 42');
    }

    process.env.TEST_ENVIRONMENT_VARIABLE = '42';
    expect(await EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', 23)).toBe(42);

    process.env.TEST_ENVIRONMENT_VARIABLE = 'test';

    try {
        await EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', 23);
    } catch (err) {
        expect(err.message).toBe('TEST_ENVIRONMENT_VARIABLE not set or not valid - example: 23');
    }

    delete process.env.TEST_ENVIRONMENT_VARIABLE;

    try {
        await EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', 23);
    } catch (err) {
        expect(err.message).toBe('TEST_ENVIRONMENT_VARIABLE not set or not valid - example: 23');
    }*/
});
