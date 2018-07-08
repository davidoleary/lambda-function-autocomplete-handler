import { expect } from 'chai';
import redis from 'redis-mock';
import uuid from 'uuid';
import sinon from 'sinon';
import SearchModel from '../src/search-model';
import SearchHandler from '../src/search';
import { ERROR_PARAM_GENDER, ERROR_PARAM_LANG } from '../src/errors';

describe('search', () => {
  before(() => {
    sinon.stub(uuid, 'v4').returns(123);
  });

  after(() => {
    uuid.v4.restore();
  });

  it('should set params as class globals', () => {
    const config = {
      language: 'en',
      gender: 'mens',
    };
    const search = new SearchHandler(config, redis.createClient());

    expect(search.params).to.deep.equal(config);
  });

  it('should return json on errorResponse', () => {
    const search = new SearchHandler({}, null);
    search.errorHelper.setError('Language parameter is invalid', ERROR_PARAM_LANG);

    search.errorResponse(400, (err, res) => {
      expect(res)
        .to.be.an('object').that.has.all.keys('statusCode', 'body')
        .to.deep.equal({
          statusCode: 400,
          body: JSON.stringify({
            head: {},
            content: {
              error: {
                message: 'Language parameter is invalid',
                code: ERROR_PARAM_LANG,
                uuid: 123,
              },
            },
          }),
        });
    });
  });

  it('should return json on successResponse', () => {
    const search = new SearchHandler({}, null);
    const body = {
      objects: [{
        name: 'something',
      }],
    };
    search.responseHelper.setContent(body);

    return search.successResponse((err, res) => {
      expect(res)
        .to.be.an('object').that.has.all.keys('statusCode', 'body')
        .to.deep.equal({
          statusCode: 200,
          body: JSON.stringify({
            head: {},
            content: body,
          }),
        });
    });
  });

  it('should return valid batchlist data', () => {
    const config = {
      language: 'en',
      gender: 'mens',
    };
    const search = new SearchHandler(config, null);
    expect(search.getBatchList()[0])
      .to.be.an('object').that.has.all.keys('entity', 'name', 'parser', 'search');
  });

  it('should return error json if language is invalid', () => {
    const config = {
      language: 'de',
      gender: 'mens',
    };
    const search = new SearchHandler(config, redis.createClient());
    return search.getResponse((err, res) => {
      expect(res)
        .to.deep.equal({
          statusCode: 400,
          body: JSON.stringify({
            head: {},
            content: {
              error: {
                message: 'Language parameter is invalid',
                code: ERROR_PARAM_LANG,
                uuid: 123,
              },
            },
          }),
        });
    });
  });

  it('should return error json if gender is invalid', () => {
    const config = {
      language: 'en',
      gender: 'girls',
    };
    const search = new SearchHandler(config, redis.createClient());
    return search.getResponse((err, res) => {
      expect(res)
        .to.deep.equal({
          statusCode: 400,
          body: JSON.stringify({
            head: {},
            content: {
              error: {
                message: 'Gender parameter is invalid',
                code: ERROR_PARAM_GENDER,
                uuid: 123,
              },
            },
          }),
        });
    });
  });

  it('should return valid json response on success', () => {
    const config = {
      language: 'en',
      gender: 'mens',
      term: 'gucci',
    };
    const search = new SearchHandler(config, redis.createClient());
    return search.getResponse((err, res) => {
      expect(res)
        .to.deep.equal({
          statusCode: 200,
          body: JSON.stringify({
            head: {},
            content: {
              popular: [],
              justin: [],
              designers: [],
              categories: [],
            },
          }),
        });
    });
  });

  it('should return error json if model.getMultiple throws an error', async () => {
    sinon.stub(SearchModel.prototype, 'getMultiple').throws('myerrr');

    const config = {
      language: 'en',
      gender: 'mens',
      term: 'gucci',
    };

    const search = new SearchHandler(config, redis.createClient());

    return search.getResponse((err, res) => {
      const expected = {
        statusCode: 500,
        body: JSON.stringify({
          head: {},
          content: {
            error: {
              message: 'Error getting data',
              code: 'ERROR_GETTING_DATA',
              uuid: 123,
            },
          },
        }),
      };

      expect(res).to.deep.equal(expected);
      SearchModel.prototype.getMultiple.restore();
    });
  });
});
