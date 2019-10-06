/* tslint:disable:max-classes-per-file */

import ConfigDecorator from '../decorator/config.decorator';
import EnvironmentVariableDecorator from '../decorator/environment-variable.decorator';
import ApplicationUtil from './application.util';

process.env.TEST_STRING = 'test';
process.env.TEST_BOOLEAN = '0';

@ConfigDecorator()
class TestConfig {
    @EnvironmentVariableDecorator({
        name: 'TEST_STRING',
        example: 'string',
    })
    protected _testString: string;

    @EnvironmentVariableDecorator({
        name: 'TEST_NUMBER',
        example: 1,
        required: false,
    })
    protected _testNumber: number | undefined;

    @EnvironmentVariableDecorator({
        name: 'TEST_BOOLEAN',
        example: true,
    })
    protected _testBoolean: boolean;

    public get testString(): string {
        return this._testString;
    }

    public get testNumber(): number | undefined {
        return this._testNumber;
    }

    public get testBoolean(): boolean {
        return this._testBoolean;
    }
}

test('environment-util', async () => {
    const testConfig = await ApplicationUtil.create<TestConfig>(TestConfig);

    try {
        @ConfigDecorator()
        class TestConfig2 {
            @EnvironmentVariableDecorator({
                name: 'TEST_STRING_EMPTY',
                example: 'string',
                allowedValues: ['john', 'doe'],
            })
            protected _testStringEmpty: string;

            @EnvironmentVariableDecorator({
                name: 'TEST_NUMBER_EMPTY',
                example: 12,
            })
            protected _testNumberEmpty: boolean;

            @EnvironmentVariableDecorator({
                name: 'TEST_NUMBER_EMPTY_BOOLEAN',
                example: true,
            })
            protected _testString2: string;
        }
    } catch (e) {
        expect(e.message).toBe('TEST_STRING_EMPTY not set or not valid - example: string - allowed values: john | doe');
    }

    expect(testConfig.testString).toBe('test');
    expect(testConfig.testNumber).toBe(undefined);
    expect(testConfig.testBoolean).toBe(false);

    /*
    process.env.TEST_ENVIRONMENT_VARIABLE = '42';
    
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
