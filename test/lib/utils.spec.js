import { expect } from 'chai';

import { jsonParser } from '../../src/lib/utils';

describe('lib', () => {
  describe('utils', () => {
    describe('jsonParser', () => {
      it('should return param if not valid json', () => {
        expect(jsonParser('abc'))
          .to.equal('abc');
      });

      it('should return object if json passed in', () => {
        const expected = {
          hello: 'dude',
        };

        expect(jsonParser(JSON.stringify(expected)))
          .to.deep.equal(expected);
      });
    });
  });
});
