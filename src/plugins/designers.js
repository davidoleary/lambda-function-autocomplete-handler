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
const search = (data, term, language) => {
  term = term.replace(REGEX_CHAR_ESCAPE, '\\$&');
  const KOREAN = 'ko';
  if (language && language.toLowerCase() === KOREAN) {
    const localizedMatch = multiWordBoundarySearch(data, term, 'designerDoubleLocalizedName');
    const nameMatch = multiWordBoundarySearch(data, term, 'designerName');
    const allMatches = [...localizedMatch, ...nameMatch];
    return [...new Set(allMatches)].slice(0, MATCHES_TO_RETURN);
  }

  return multiWordBoundarySearch(data, term, 'designerName');
};

export default {
  parser,
  search,
};
