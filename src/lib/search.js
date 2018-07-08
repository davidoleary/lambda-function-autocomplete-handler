/**
 * This method will search each word in a string in the list data for a match
 * @param {Array} data List of data to search
 * @param {string} value Value to search for
 * @param {string} key Optional key to search in object from
 * @param {int} limit Size of results to return
 */
const wordBoundarySearch = (data, value, key = '', limit = 10) => {
  const result = [];
  const boundaryRegEx = new RegExp(`(?:^|\\s)${value}`, 'gui');
  let count = 0;

  for (let term of data) {
    if (count >= limit) {
      break;
    }

    const str = (key) ? term[key] : term;
    let found = false;
    if (str) {
      found = str.match(boundaryRegEx);
    }

    if (found) {
      count += 1;
      result.push(term);
    }
  }
  return result;
};

/**
 * This method will search each word in a string in the list data for a match with multipe words
 * @param {Array} data List of data to search
 * @param {string} value Value to search for, can be a sentence
 * @param {string} key Optional key to search in object from
 * @param {int} limit Size of results to return
 */
const multiWordBoundarySearch = (data, searchTerm, key = '', limit = 10) => {

  const fullMatch = wordBoundarySearch(data, searchTerm, key, limit);
  if (fullMatch.length >= limit) {
    return fullMatch;
  }

  let result = [...fullMatch];
  let count = fullMatch.length;

  const words = searchTerm.split(' ');
  for (let dataTerm of data) {
    if (count >= limit) {
      break;
    }

    const str = (key) ? dataTerm[key] : dataTerm;
    let found = false;
    if (str) {
      found = words.find((word) => {
        const boundaryRegEx = new RegExp(`(?:^|\\s)${word}`, 'gui');
        return str.match(boundaryRegEx);
      });
    }

    if (found && !result.includes(dataTerm)) {
      count += 1;
      result.push(dataTerm);
    }
  }

  return result;
};

const searchForEveryMatch = (data, searchTerms, limit = 10) => {
  const result = [];
  const termParts = searchTerms.trim().toLowerCase().split(' ');

  for(let dataEntry of data) {
    if (getAndMatch(termParts, dataEntry)) {
      result.push(dataEntry);
      if (result.length >= limit) {
        break;
      }
    }
  }

  return result;
};

function getAndMatch(termParts, dataEntry) {
  var matchedTerms = {};
  for (let field in dataEntry) {
    if (dataEntry.hasOwnProperty(field)) {
      var fieldParts = dataEntry[field].trim().toLowerCase().split(" ");
      for (let term of termParts) {
        if (!matchedTerms[term]) {
          matchedTerms[term] = fieldParts.some((part) =>
          {
            return part.includes(term);
          });
        }
      }
    }
  }
  for (let matchedPart of termParts) {
    if (!matchedTerms[matchedPart]) return false;
  }
  return true;
}

export {
  searchForEveryMatch,
  wordBoundarySearch,
  multiWordBoundarySearch,
};
