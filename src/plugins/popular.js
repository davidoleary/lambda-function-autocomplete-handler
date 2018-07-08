import { multiWordBoundarySearch } from '../lib/search';
import { REGEX_CHAR_ESCAPE } from '../lib/config';

const search = (data, term) => multiWordBoundarySearch(data, term.replace(REGEX_CHAR_ESCAPE, '\\$&'));

export default {
  search,
  parser: (data) => {
    const result = data.map(item => JSON.parse(item));
    return result;
  },
};
