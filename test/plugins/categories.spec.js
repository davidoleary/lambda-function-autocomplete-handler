import { expect } from 'chai';

import { categories } from '../../src/plugins';
import categoriesMensEn from '../mocks/autocomplete_categories-data_en_mens.json';

describe('parsers', () => {
  describe('categories', () => {
    describe('parser', () => {
      it('should return data untouched if not valid json', () => {
        const expected = [
          'abc',
          'def',
        ];

        expect(categories.parser(expected))
          .to.deep.equal(expected);
      });

      it('should return object if json passed in', () => {
        const expected = {
          hello: 'dude',
        };

        expect(categories.parser([JSON.stringify(expected)]))
          .to.deep.equal([expected]);
      });
    });

    describe('search', () => {
      it('should find matches when a specifying search field', () => {
        const expected = [
          {
            name: 'Leather Belts',
            parentName: 'Belts',
            url: '/mens/shop/accessories/belts/leather-belts?is=Leather Belts',
          },
          {
            name: 'Fabric Belts',
            parentName: 'Belts',
            url: '/mens/shop/accessories/belts/fabric-belts?is=Fabric Belts',
          },
          {
            name: 'Belts',
            parentName: 'Accessories',
            url: '/mens/shop/accessories/belts?is=Belts',
          },
        ];

        expect(categories.search(categoriesMensEn, 'Belts'))
          .to.be.an('array')
          .to.be.length(3)
          .to.include.deep.members(expected);
      });

      it('should find matches for each word in search term', () => {
        const mixedData = [{
          name: 'Accessories',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }, {
          name: 'Bags',
          parentName: '',
          url: '/mens/shop/bags?is=Bags',
        }, {
          name: 'Clothing bags',
          parentName: '',
          url: '/mens/shop/clothing?is=Clothing',
        }, {
          name: 'Shoes',
          parentName: '',
          url: '/mens/shop/shoes?is=Shoes',
        }, {
          name: 'bag Belts',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/belts?is=Belts',
        }, {
          name: 'Cufflinks, Pins & Clips',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/cufflinks,-pins-and-clips?is=Cufflinks, Pins & Clips',
        }, {
          name: 'Gloves',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'Gloves bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }];

        const expected = [{
          name: 'Clothing bags',
          parentName: '',
          url: '/mens/shop/clothing?is=Clothing',
        }, {
          name: 'Bags',
          parentName: '',
          url: '/mens/shop/bags?is=Bags',
        }, {
          name: 'Gloves bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }];

        expect(categories.search(mixedData, 'Clothing bags'))
          .to.be.an('array')
          .to.be.length(3)
          .to.deep.equal(expected);
      });

      it('should find 10 unique matches from the data', () => {
        const mixedData = [{
          name: 'Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }, {
          name: 'Bags',
          parentName: '',
          url: '/mens/shop/bags?is=Bags',
        }, {
          name: 'Clothing bags',
          parentName: '',
          url: '/mens/shop/clothing?is=Clothing',
        }, {
          name: 'Shoes bags',
          parentName: '',
          url: '/mens/shop/shoes?is=Shoes',
        }, {
          name: 'bags Belts',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/belts?is=Belts',
        }, {
          name: 'Cufflinks, Pins & Clips bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/cufflinks,-pins-and-clips?is=Cufflinks, Pins & Clips',
        }, {
          name: 'Gloves bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'Gloves bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'toth bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'real bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'bilbo bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }];

        const expected = [{
          name: 'Clothing bags',
          parentName: '',
          url: '/mens/shop/clothing?is=Clothing',
        }, {
          name: 'Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }, {
          name: 'Bags',
          parentName: '',
          url: '/mens/shop/bags?is=Bags',
        }, {
          name: 'Shoes bags',
          parentName: '',
          url: '/mens/shop/shoes?is=Shoes',
        }, {
          name: 'bags Belts',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/belts?is=Belts',
        }, {
          name: 'Cufflinks, Pins & Clips bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/cufflinks,-pins-and-clips?is=Cufflinks, Pins & Clips',
        }, {
          name: 'Gloves bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'Gloves bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'toth bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'real bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }];

        expect(categories.search(mixedData, 'Clothing bags'))
          .to.be.an('array')
          .to.be.length(10)
          .to.deep.equal(expected);
      });

      it('should find a maximum of 10 unique matches from the data', () => {
        const mixedData = [{
          name: 'Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }, {
          name: 'Bags',
          parentName: '',
          url: '/mens/shop/bags?is=Bags',
        }, {
          name: 'Clothing bags',
          parentName: '',
          url: '/mens/shop/clothing?is=Clothing',
        }, {
          name: 'Shoes bags',
          parentName: '',
          url: '/mens/shop/shoes?is=Shoes',
        }, {
          name: 'bags Belts',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/belts?is=Belts',
        }, {
          name: 'Cufflinks, Pins & Clips bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/cufflinks,-pins-and-clips?is=Cufflinks, Pins & Clips',
        }, {
          name: 'Gloves bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'Gloves bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'toth bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'real bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'bilbo bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'bilbo',
          parentName: 'bags',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'hats',
          parentName: 'bags Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'belts',
          parentName: 'Accessories bags',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'shoes',
          parentName: 'bagss',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'scarf',
          parentName: 'more bags',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }];

        const expected = [{
          name: 'Clothing bags',
          parentName: '',
          url: '/mens/shop/clothing?is=Clothing',
        }, {
          name: 'Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }, {
          name: 'Bags',
          parentName: '',
          url: '/mens/shop/bags?is=Bags',
        }, {
          name: 'Shoes bags',
          parentName: '',
          url: '/mens/shop/shoes?is=Shoes',
        }, {
          name: 'bags Belts',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/belts?is=Belts',
        }, {
          name: 'Cufflinks, Pins & Clips bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/cufflinks,-pins-and-clips?is=Cufflinks, Pins & Clips',
        }, {
          name: 'Gloves bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'Gloves bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'toth bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }, {
          name: 'real bags',
          parentName: 'Accessories',
          url: '/mens/shop/accessories/gloves?is=Gloves',
        }];

        expect(categories.search(mixedData, 'Clothing bags'))
          .to.be.an('array')
          .to.be.length(10)
          .to.deep.equal(expected);
      });

      it('should escape special characters', () => {
        const specialCharsData = [{
          name: '120%| Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }, {
          name: '120% Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }];

        const expected = [{
          name: '120%| Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }];
        expect(categories.search(specialCharsData, '120%|'))
          .to.be.an('array')
          .to.be.length(1)
          .to.deep.equal(expected);
      });

      it('should escape special characters2', () => {
        const specialCharsData = [{
          name: '120%* Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }, {
          name: '120% Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }];

        const expected = [{
          name: '120%* Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }];
        expect(categories.search(specialCharsData, '120%*'))
          .to.be.an('array')
          .to.be.length(1)
          .to.deep.equal(expected);
      });

      it('should escape special characters2', () => {
        const specialCharsData = [{
          name: '120%{ Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }, {
          name: '120% Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }];

        const expected = [{
          name: '120%{ Accessories bags',
          parentName: '',
          url: '/mens/shop/accessories?is=Accessories',
        }];
        expect(categories.search(specialCharsData, '120%{'))
          .to.be.an('array')
          .to.be.length(1)
          .to.deep.equal(expected);
      });
    });
  });
});
