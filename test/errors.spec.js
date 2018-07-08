import { expect } from 'chai';

import { ERROR_PARAM_LANG, ERROR_PARAM_GENDER } from '../src/errors';

describe('errors', () => {
  it('ERROR_PARAM_LANG should be equal to "ERROR_PARAM_LANG"', () => {
    expect(ERROR_PARAM_LANG)
      .to.equal('ERROR_PARAM_LANG');
  });

  it('ERROR_PARAM_GENDER should be equal to "ERROR_PARAM_GENDER"', () => {
    expect(ERROR_PARAM_GENDER)
      .to.equal('ERROR_PARAM_GENDER');
  });
});
