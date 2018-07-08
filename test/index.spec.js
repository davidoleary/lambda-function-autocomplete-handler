import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('index', () => {
  let index;
  beforeEach(() => {
    const searchMock = function () {};

    index = proxyquire('../src/index', {
      redis: {
        createClient: sinon.stub(),
      },
      './search': searchMock,
    });
  });

  it('should return empty result for bad request', (done) => {
    const expected = {
      head: {},
      content: {
        popular: [],
        justin: [],
        designers: [],
        categories: [],
      },
    };
    const event = {
      language: 'en',
      gender: 'mens',
    };
    const context = {};
    index.search(event, context, (err, data) => {
      expect(data).to.deep.equal(expected);
      done();
    });
  });
});
