import { jsonParser } from '../lib/utils';
import { searchForEveryMatch } from '../lib/search';
import { MATCHES_TO_RETURN } from '../lib/config';
/**
 * Parser for justin data
 * @param {Array} data
 */
const parser = data => data.map(str => jsonParser(str));

/**
 * Search function for justin data
 * @param {Array} data Data to search in
 * @param {string} term Term to search for
 */
const search = (data, term) => {
  const everyTermMatch = searchForEveryMatch(data, term);
  return [...new Set(everyTermMatch)].slice(0, MATCHES_TO_RETURN);
};

export default {
  parser,
  search,
};
