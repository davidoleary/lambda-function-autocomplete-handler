import { expect } from 'chai';

import { popular } from '../../src/plugins';
import popularMensEn from '../mocks/autocomplete_popular-data_en_mens.json';

describe('parsers', () => {
  describe('search', () => {
    it('should find matches when a specifying search field', () => {
      const expected = [
        'Gucci ',
        'Gucci Gloves',
        'Gucci Lace-Up Shoes',
        'Gucci Shoes',
        'Gucci Hats',
        'Gucci Wallets',
        'Gucci Track Pants',
        'Gucci Sweats',
        'Gucci Caps',
        'Gucci Trilby Hats',
      ];

      expect(popular.search(popularMensEn, 'gucci'))
        .to.be.an('array')
        .to.be.length(10)
        .to.include.members(expected);
    });

    it('should find matches for each word in search term', () => {
      const mixedData = [
        'Loui ',
        'Loui Gloves',
        'Loui Lace-Up Shoes',
        'Loui Track Pants',
        'will not match',
        'Loui Sweats',
        'Loui Caps',
        'should not match anything',
        'Cap',
        'Caps',
        'Loui Trilby Hats',
      ];

      const expected = [
        'Loui Caps',
        'Loui ',
        'Loui Gloves',
        'Loui Lace-Up Shoes',
        'Loui Track Pants',
        'Loui Sweats',
        'Cap',
        'Caps',
        'Loui Trilby Hats',
      ];

      expect(popular.search(mixedData, 'loui cap'))
        .to.be.an('array')
        .to.be.length(9)
        .to.deep.equal(expected);
    });

    it('should find 10 unique matches from the data', () => {
      const mixedData = [
        'Loui ',
        'Loui Gloves',
        'Loui Lace-Up Shoes',
        'Loui Track Pants',
        'will not match',
        'Loui Sweats',
        'Loui Caps',
        'should not match anything',
        'Cap',
        'Caps',
        'Loui Trilby Hats',
        'Capo',
        'Capi',
      ];

      const expected = [
        'Loui Caps',
        'Loui ',
        'Loui Gloves',
        'Loui Lace-Up Shoes',
        'Loui Track Pants',
        'Loui Sweats',
        'Cap',
        'Caps',
        'Loui Trilby Hats',
        'Capo',
      ];

      expect(popular.search(mixedData, 'loui cap'))
        .to.be.an('array')
        .to.be.length(10)
        .to.deep.equal(expected);
    });

    it('should favour whole match', () => {
      const mixedData = [
        'Loui ',
        'Loui Gloves',
        'Loui Lace-Up Shoes',
        'Loui Track Pants',
        'will not match',
        'Loui Sweats',
        'Loui Caps',
        'should not match anything',
        'Cap',
        'Caps',
        'Loui Trilby Hats',
        'Capo',
        'Capi',
      ];

      const expected = [
        'Loui Caps',
        'Loui ',
        'Loui Gloves',
        'Loui Lace-Up Shoes',
        'Loui Track Pants',
        'Loui Sweats',
        'Cap',
        'Caps',
        'Loui Trilby Hats',
        'Capo',
      ];

      expect(popular.search(mixedData, 'loui cap'))
        .to.be.an('array')
        .to.be.length(10)
        .to.deep.equal(expected);
    });

    it('should match indvidual words', () => {
      const data = [
        'some random thing',
        'tops',
        'Shirt Dresses',
        'Shirts',
        'Isabel Marant Etoile Shirts',
        'Isabel Marant Etoile Mexika Floral - Print Cotton Shirt',
        'Isabel Marant Etoile Lawendy Ruffle - Trimmed Stretch - Cotton Shirt',
        'Isabel Marant Etoile Wendy Ruffle - Trimmed Checked Cotton Shirt',
        'Isabel Marant Etoile Wendy Ruffle - Trimmed Chambray Shirt',
        'Isabel Marant Etoile Only Vintage Striped Cotton Shirt',
        'Bliss And Mischief Cherry - Embroidered Cotton - Voile Shirt',
        'Isabel Marant Etoile Oak High - Neck Striped Cotton Shirt',
        'Bliss And Mischief Shirts',
        'Christian Louboutin Shoes',
      ];

      const expected = [
        'Shirt Dresses',
        'Shirts',
        'Isabel Marant Etoile Shirts',
        'Isabel Marant Etoile Mexika Floral - Print Cotton Shirt',
        'Isabel Marant Etoile Lawendy Ruffle - Trimmed Stretch - Cotton Shirt',
        'Isabel Marant Etoile Wendy Ruffle - Trimmed Checked Cotton Shirt',
        'Isabel Marant Etoile Wendy Ruffle - Trimmed Chambray Shirt',
        'Isabel Marant Etoile Only Vintage Striped Cotton Shirt',
        'Bliss And Mischief Cherry - Embroidered Cotton - Voile Shirt',
        'Isabel Marant Etoile Oak High - Neck Striped Cotton Shirt',
      ];

      expect(popular.search(data, 'black shirt'))
        .to.be.an('array')
        .to.be.length(10)
        .to.deep.equal(expected);
    });

    it('should match special character', () => {
      const dataWithSpecialChars = [
        'some random thing',
        'tops',
        '120%| Lino Shirts',
        '120% Lino Shirts',
        'Shirts',
        'Isabel Marant Etoile Shirts',
        'Isabel Marant Etoile Mexika Floral - Print Cotton Shirt',
        'Isabel Marant Etoile Oak High - Neck Striped Cotton Shirt',
        'Bliss And Mischief Shirts',
        'Christian Louboutin Shoes',
      ];

      const expected = [
        '120%| Lino Shirts',
      ];

      expect(popular.search(dataWithSpecialChars, '120%|'))
              .to.be.an('array')
              .to.be.length(1)
              .to.deep.equal(expected);
    });
  });

  describe('parser', () => {
    it('should JSON parse each entry to remove escaped qoures', () => {
      // Array of strings seem to be wrapped in extra qoutes
      const dataFromRedis = [
        '"Gucci "',
        '"Gucci Gloves"',
        '"Gucci Lace-Up Shoes"',
        '"Gucci Shoes"',
        '"Gucci Hats"',
        '"Gucci Wallets"',
        '"Gucci Track Pants"',
        '"Gucci Sweats"',
        '"Gucci Caps"',
        '"Gucci Trilby Hats"',
      ];
      const expected = [
        'Gucci ',
        'Gucci Gloves',
        'Gucci Lace-Up Shoes',
        'Gucci Shoes',
        'Gucci Hats',
        'Gucci Wallets',
        'Gucci Track Pants',
        'Gucci Sweats',
        'Gucci Caps',
        'Gucci Trilby Hats',
      ];

      expect(popular.parser(dataFromRedis))
        .to.be.an('array')
        .to.deep.equal(expected);
    });
  });
});
