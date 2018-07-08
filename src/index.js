import redis from 'redis';

import Search from './search';
import { Response } from './lib/response';

/**
 * /api/v1/search?term={}&gender={male|female}
 */
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

function isValidRequest(event) {
  const { language, term, gender } = event;
  if (event && language && term && gender) {
    return true;
  }

  return false;
}

export function search(event, context, callback) {
  if (isValidRequest(event)) {
    const client = redis.createClient({
      host: REDIS_HOST,
      port: REDIS_PORT,
    });

    return new Search({
      language: event.language,
      gender: event.gender,
      term: event.term,
    }, client)
    .getResponse((err, res) => {
      callback(err, JSON.parse(res.body));
    });
  }

  const emptyResponse = new Response();
  emptyResponse.setContent({
    popular: [],
    justin: [],
    designers: [],
    categories: [],
  });
  callback(null, emptyResponse.getResponse());
}
