import SearchModel from './search-model';
import { justin, popular, designers, categories } from '../src/plugins';
import { Response, ErrorResponse } from './lib/response';
import { ERROR_PARAM_GENDER, ERROR_PARAM_LANG, ERROR_GETTING_DATA } from './errors';

const LANGUAGES = process.env.LANGUAGES || ['en'];
const GENDERS = process.env.GENDERS || ['mens'];

class Search {
  constructor(params, client) {
    this.params = params;
    this.client = client;
    this.responseHelper = new Response();
    this.errorHelper = new ErrorResponse();
  }

  errorResponse(statusCode, callback) {
    callback(null, {
      statusCode,
      body: JSON.stringify(this.errorHelper.getResponse()),
    });
  }

  successResponse(callback) {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(this.responseHelper.getResponse()),
    });
  }

  getBatchList() {
    return [
      {
        entity: 'popular',
        name: `autocomplete_popular-data_${this.params.language}_${this.params.gender}`,
        parser: popular.parser,
        search: popular.search,
      },
      {
        entity: 'justin',
        name: `autocomplete_justin-data_${this.params.language}_${this.params.gender}`,
        parser: justin.parser,
        search: justin.search,
      },
      {
        entity: 'designers',
        name: `autocomplete_designers-data_${this.params.language}_${this.params.gender}`,
        parser: designers.parser,
        search: designers.search,
      },
      {
        entity: 'categories',
        name: `autocomplete_categories-data_${this.params.language}_${this.params.gender}`,
        parser: categories.parser,
        search: categories.search,
      },
    ];
  }

  async getResponse(callback) {
    if (!LANGUAGES.includes(this.params.language)) {
      this.errorHelper.setError('Language parameter is invalid', ERROR_PARAM_LANG);
      this.client.quit();
      return this.errorResponse(
        400,
        callback,
      );
    }

    if (!GENDERS.includes(this.params.gender)) {
      this.errorHelper.setError('Gender parameter is invalid', ERROR_PARAM_GENDER);
      this.client.quit();
      return this.errorResponse(
        400,
        callback,
      );
    }

    const keys = this.getBatchList(this.params.language, this.params.gender);
    const model = new SearchModel(this.client);
    let result;

    try {
      result = await model.getMultiple(keys);
    } catch (error) {
      this.errorHelper.setError('Error getting data', ERROR_GETTING_DATA);
      this.client.quit();
      return this.errorResponse(
        500,
        callback,
      );
    }

    const body = {};

    keys.forEach((key, index) => {
      body[key.entity] = key.search(result[index], this.params.term, this.params.language);
    });

    this.responseHelper.setContent(body);
    this.client.quit();

    return this.successResponse(callback);
  }
}

export default Search;
