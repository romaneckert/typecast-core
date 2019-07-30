import EnvironmentVariable from './environment-variable';

test('getAsString', () => {
    process.env.TEST_ENVIRONMENT_VARIABLE = '42';
    expect(EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', '23')).toBe('42');

    process.env.TEST_ENVIRONMENT_VARIABLE = 'test';
    expect(EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', 'a test string')).toBe('test');

    delete process.env.TEST_ENVIRONMENT_VARIABLE;
    expect(() => EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', '42')).toThrow('TEST_ENVIRONMENT_VARIABLE not set or not valid - example: 42');
});

test('getAsNumber', () => {
    process.env.TEST_ENVIRONMENT_VARIABLE = '42';
    expect(EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', 23)).toBe(42);

    process.env.TEST_ENVIRONMENT_VARIABLE = 'test';
    expect(() => EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', 23)).toThrow('TEST_ENVIRONMENT_VARIABLE not set or not valid - example: 23');

    delete process.env.TEST_ENVIRONMENT_VARIABLE;
    expect(() => EnvironmentVariable.get('TEST_ENVIRONMENT_VARIABLE', 23)).toThrow('TEST_ENVIRONMENT_VARIABLE not set or not valid - example: 23');
});
