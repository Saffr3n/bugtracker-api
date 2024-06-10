import * as utils from '../../src/utils';

export default () => {
  jest
    .spyOn(utils, 'stringToCaseInsensitiveRegex')
    .mockImplementation((string) => string as unknown as RegExp);
};
