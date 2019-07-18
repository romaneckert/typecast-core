import './string';

test('isNumeric', () => {
    expect(String.isNumber(null)).toBe(false);
    expect(String.isNumber(undefined)).toBe(false);
    expect(String.isNumber('test')).toBe(false);
    expect(String.isNumber('test string')).toBe(false);
    expect(String.isNumber('123 123')).toBe(false);
    expect(String.isNumber('123')).toBe(true);

    expect('test'.isNumber()).toBe(false);
    expect('test string'.isNumber()).toBe(false);
    expect('123 123'.isNumber()).toBe(false);
    expect('123'.isNumber()).toBe(true);
});
