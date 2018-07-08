import { expect } from 'chai';

import { wordBoundarySearch } from '../../src/lib/search';

describe('lib', () => {
  describe('wordBoundarySearch', () => {
    it('should match at the beginning of string', () =>
      expect(wordBoundarySearch(['Loup Charmant Dresses'], 'lou'))
        .to.be.an('array')
        .and.to.include.members(
        [
          'Loup Charmant Dresses',
        ],
      ),
    );

    it('should match multiple', () => {
      const data = [
        'Christian Louboutin Shoes',
        'Christian Louboutin Heels',
        'Loup Charmant Dresses',
        'Isabel Marant Etoile Blouses',
        'Blouse Tops',
      ];

      expect(wordBoundarySearch(data, 'lou'))
        .to.be.an('array')
        .and.to.include.members([
          'Christian Louboutin Shoes',
          'Christian Louboutin Heels',
          'Loup Charmant Dresses',
        ]);
    });

    it('should match case insensitive', () =>
      expect(wordBoundarySearch(['CHRISTIAN LOUBOUTIN SHOES'], 'lou'))
        .to.be.an('array')
        .and.to.include.members(
        [
          'CHRISTIAN LOUBOUTIN SHOES',
        ],
      ),
    );

    it('should match at the beginning of string in second word', () =>
      expect(wordBoundarySearch(['Christian Louboutin Shoes'], 'lou'))
        .to.be.an('array')
        .and.to.include.members(
        [
          'Christian Louboutin Shoes',
        ],
      ),
    );

    it('should not match in a word', () =>
      expect(wordBoundarySearch(['Blouse Tops'], 'lou'))
        .to.be.an('array')
        .and.to.include.members([]),
    );

    it('should match when searching field on array of objects', () => {
      const data = [
        { name: 'Christian Louboutin Shoes' },
        { name: 'Christian Louboutin Heels' },
        { name: 'Loup Charmant Dresses' },
        { name: 'Isabel Marant Etoile Blouses' },
        { name: 'Blouse Tops' },
      ];

      expect(wordBoundarySearch(data, 'lou', 'name')).to.be.an('array')
        .and.to.deep.include.members([
          { name: 'Christian Louboutin Shoes' },
          { name: 'Christian Louboutin Heels' },
          { name: 'Loup Charmant Dresses' },
        ]);
    });

    it('should limit results', () => {
      const data = [
        'Christian Louboutin Shoes',
        'Christian Louboutin Heels',
        'Loup Charmant Dresses',
        'Isabel Marant Etoile Blouses',
        'Blouse Tops',
      ];

      expect(wordBoundarySearch(data, 'lou', '', 2))
        .to.be.an('array')
        .to.be.length(2);
    });
  });
});
