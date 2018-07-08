import { expect } from 'chai';
import redis from 'redis-mock';

import { justin } from '../src/plugins';
import SearchModel from '../src/search-model';


describe('search-model', () => {
  const client = redis.createClient();
  const model = new SearchModel(client);

  afterEach(() => {
    client.flushall();
  });

  after(() => {
    client.quit();
  });

  describe('getAllKeys', () => {
    it('should return a list of keys', async () => {
      const expected = [
        'key_one',
        'key_two',
        'key_three',
      ];

      client.rpush('key_one', '');
      client.rpush('key_two', '');
      client.rpush('key_three', '');

      const data = await model.getAllKeys();

      expect(data)
        .to.be.an('array')
        .and.to.have.same.members(expected);
    });
  });

  describe('getMultiple', () => {
    it('should fail if passing in string when array is expected', () => {
      expect(() => model.getMultiple('abc'))
        .to.throw('Keys param must be a valid array');
    });

    it('should return empty array if empty keys passed in', async () => {
      const expected = [];
      const data = await model.getMultiple([]);

      expect(data)
        .to.be.an('array')
        .and.to.have.same.members(expected);
    });

    it('should return data matching a key', async () => {
      const expected = [
        'Gucci Shoes',
        'Gucci Shoes',
        'Self-Portrait Dresses',
      ];

      client.rpush('autocomplete_popular-data_en_womens', expected);

      const data = await model.getMultiple(
        [
          { name: 'autocomplete_popular-data_en_womens', parser: null },
        ],
      );

      expect(data[0])
        .to.be.an('array')
        .and.to.have.same.members(expected);
    });

    it('should return data matching multiple keys', async () => {
      const expected = [
        [
          'Gucci Shoes',
          'Gucci Shoes',
          'Self-Portrait Dresses',
        ],
        [
          {
            sku: '1174426',
            freshness: '2017-08-01 00:00:00.0',
            title: 'Drawstring cotton-dobby dress	',
            designerName: 'Wiggy Kit',
            url: '/products/1174426?is=1174426',
            ESP_CategoryTitles: 'Womens',
            colour: 'WHITE',
            categories: 'Clothing Beachwear Beach Dresses',
          },
        ],
      ];

      client.rpush('autocomplete_popular-data_en_womens', expected[0]);
      client.rpush('autocomplete_justin-data_en_womens', expected[1]);

      const data = await model.getMultiple(
        [
          { name: 'autocomplete_popular-data_en_womens', parser: null },
          { name: 'autocomplete_justin-data_en_womens', parser: justin.parser },
        ],
      );

      expect(data)
        .to.be.an('array')
        .and.to.have.deep.members(expected);
    });
  });
});
