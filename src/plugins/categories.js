import { jsonParser } from '../lib/utils';
import { multiWordBoundarySearch } from '../lib/search';
import { MATCHES_TO_RETURN, REGEX_CHAR_ESCAPE } from '../lib/config';
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
  term = term.replace(REGEX_CHAR_ESCAPE, '\\$&');
  const nameMatch = multiWordBoundarySearch(data, term, 'name');
  const parentNameMatch = multiWordBoundarySearch(data, term, 'parentName');

  const allMatches = [...nameMatch, ...parentNameMatch];
  return [...new Set(allMatches)].slice(0, MATCHES_TO_RETURN);
};

export default {
  parser,
  search,
};
