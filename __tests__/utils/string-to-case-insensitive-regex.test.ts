import { stringToCaseInsensitiveRegex } from '../../src/utils';

describe('stringToCaseInsensitiveRegex utility function', () => {
  const strictRegex = stringToCaseInsensitiveRegex('test');
  const nonStrictRegex = stringToCaseInsensitiveRegex('test', false);

  it('when strict, does not match substring within larger string', () => {
    expect(strictRegex.test('something_test_something')).toBeFalsy();
  });

  it('when not strict, matches substring within larger string', () => {
    expect(nonStrictRegex.test('something_test_something')).toBeTruthy();
  });

  it('strict or not, matches exact string', () => {
    expect(strictRegex.test('test')).toBeTruthy();
    expect(nonStrictRegex.test('test')).toBeTruthy();
  });

  it('strict or not, matches string regardless of case', () => {
    expect(strictRegex.test('TEST')).toBeTruthy();
    expect(nonStrictRegex.test('TEST')).toBeTruthy();
  });
});
