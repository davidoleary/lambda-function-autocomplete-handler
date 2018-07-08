import { expect } from 'chai';

import { justin } from '../../src/plugins';
import justinMensEn from '../mocks/autocomplete_justin-data_mens.json';

describe('parsers', () => {
  describe('justin', () => {
    describe('parser', () => {
      it('should return data untouched if not valid json', () => {
        const expected = [
          'abc',
          'def',
        ];

        expect(justin.parser(expected))
          .to.deep.equal(expected);
      });

      it('should return object if json passed in', () => {
        const expected = {
          hello: 'dude',
        };

        expect(justin.parser([JSON.stringify(expected)]))
          .to.deep.equal([expected]);
      });
    });

    describe('search', () => {
      it('should find matches when a specifying search field', () => {
        const expected = [
          {
            ESP_CategoryTitles: 'Mens',
            categories: 'Shoes Sneakers Low top Sneakers',
            colour: 'WHITE MULTI',
            designerName: 'Gucci',
            sku: '1068770',
            title: 'Laser-cut low-top leather trainers',
            url: '/products/1068770?gender=mens',
          },
          {
            ESP_CategoryTitles: 'Mens',
            categories: 'Clothing Coats and Jackets Gilets',
            colour: 'GREEN',
            designerName: 'Gucci',
            sku: '1055400',
            title: 'Hooded quilted-down gilet',
            url: '/products/1055400?gender=mens',
          },
        ];

        expect(justin.search(justinMensEn, 'gucci'))
          .to.be.an('array')
          .to.be.length(8)
          .to.include.deep.members(expected);
      });

      it('should find matches for colours', () => {
        const justinColoursEN = [
          {
            sku: '1063873',
            title: 'Venetian suede loafers',
            designerName: 'Mansur Gavriel',
            url: '/products/1063873?gender=womens',
            ESP_CategoryTitles: 'Womens',
            colour: 'NAVY',
            categories: 'Shoes Flats Loafers',
          },
          {
            sku: '1063874',
            title: 'Ballerina suede pumps',
            designerName: 'Mansur Gavriel',
            url: '/products/1063874?gender=womens',
            ESP_CategoryTitles: 'Womens',
            colour: 'PINK',
            categories: 'Shoes Heels Pumps',
          },
          {
            sku: '1063875',
            title: 'Ballerina suede pumps',
            designerName: 'Mansur Gavriel',
            url: '/products/1063875?gender=womens',
            ESP_CategoryTitles: 'Womens',
            colour: 'YELLOW',
            categories: 'Shoes Heels Mid heels',
          },
        ];

        const expected = [
          {
            sku: '1063875',
            title: 'Ballerina suede pumps',
            designerName: 'Mansur Gavriel',
            url: '/products/1063875?gender=womens',
            ESP_CategoryTitles: 'Womens',
            colour: 'YELLOW',
            categories: 'Shoes Heels Mid heels',
          },
        ];

        expect(justin.search(justinColoursEN, 'yellow'))
          .to.be.an('array')
          .to.be.length(1)
          .to.include.deep.members(expected);
      });

      it('should find a maximum of 10 unique matches from the data', () => {
        const dataWithMoreThanTen = [
          {
            title: 'Sports swim shorts',
            designerName: 'Select Me Carioca',
          },
          {
            title: '1 swim shorts',
            designerName: '1 Select Me Carioca, shorts',
          },
          {
            title: '2 Sports swim shorts',
            designerName: '2 Select Me Carioca, shorts',
          },
          {
            title: '3 Sports swim shorts',
            designerName: '3 Select Me, shorts',
          },
          {
            title: '4 Sports Select Me shorts',
            designerName: '4 Frescobol Carioca, shorts',
          },
          {
            title: '5 Sports swim shorts',
            designerName: '5 Select Me Carioca, shorts',
          },
          {
            title: '6 Sports swim shorts',
            designerName: '6 Carioca, shorts',
          },
          {
            title: '7 Sports Select Me shorts',
            designerName: '7 Frescobol Carioca, shorts',
          },
          {
            title: '8 Sports swim',
            designerName: '8 Select Me Carioca, shorts',
          },
          {
            title: '9 Sports swim shorts',
            designerName: '9 Frescobol Carioca, shorts',
          },
          {
            title: '10 Sports swim shorts',
            designerName: '10 Select Me Carioca, shorts',
          },
          {
            title: '11 Sports swim Select Me',
            designerName: '11 Frescobol Select Me, shorts',
          },
        ];

        const expected = [
          {
            title: 'Sports swim shorts',
            designerName: 'Select Me Carioca',
          },
          {
            title: '1 swim shorts',
            designerName: '1 Select Me Carioca, shorts',
          },
          {
            title: '2 Sports swim shorts',
            designerName: '2 Select Me Carioca, shorts',
          },
          {
            title: '3 Sports swim shorts',
            designerName: '3 Select Me, shorts',
          },
          {
            title: '4 Sports Select Me shorts',
            designerName: '4 Frescobol Carioca, shorts',
          },
          {
            title: '5 Sports swim shorts',
            designerName: '5 Select Me Carioca, shorts',
          },
          {
            title: '7 Sports Select Me shorts',
            designerName: '7 Frescobol Carioca, shorts',
          },
          {
            title: '8 Sports swim',
            designerName: '8 Select Me Carioca, shorts',
          },
          {
            title: '10 Sports swim shorts',
            designerName: '10 Select Me Carioca, shorts',
          },
          {
            title: '11 Sports swim Select Me',
            designerName: '11 Frescobol Select Me, shorts',
          },
        ];

        expect(justin.search(dataWithMoreThanTen, 'Select me'))
          .to.be.an('array')
          .to.be.length(10)
          .to.deep.equal(expected);
      });
    });

    it('should find only result with every search term present', () => {
      const dataWithBothSearchTerms = [{
        sku: 'good',
        title: 'Powder Blue printed T-shirt hats',
        designerName: 'BLUE ROSES',
        url: '/products/1063873?gender=womens',
        ESP_CategoryTitles: 'Womens',
        colour: 'RED',
        categories: 'Shoes test Loafers',
      },
      {
        sku: 'good',
        title: 'Ballerina suede hats pumps blue',
        designerName: 'Mansur Gavriel',
        url: '/products/1063874?gender=womens',
        ESP_CategoryTitles: 'Womens',
        colour: 'PINK',
        categories: 'Shoes Heels Pumps',
      },
      {
        sku: 'good',
        title: 'Ballerina suede pumps',
        designerName: 'Mansur Gavriel',
        url: '/products/1063874?gender=womens',
        ESP_CategoryTitles: 'Womens',
        colour: 'blue',
        categories: 'hat Shoes Heels Pumps blue',
      },
      {
        sku: 'good',
        title: 'Ballerina suede pumps',
        designerName: 'Mansur Gavriel',
        url: '/products/1063874?gender=womens',
        ESP_CategoryTitles: 'Womens',
        colour: 'BLUE',
        categories: 'Shoes Heels Pumps',
      },
      {
        sku: 'NOT GOOD',
        title: 'Ballerina suede pumps',
        designerName: 'Mansur Gavriel',
        url: '/products/1063875?gender=womens',
        ESP_CategoryTitles: 'Womens',
        colour: 'PINK',
        categories: 'Heels Mid heels hats',
      }];

      const expected = [{
        sku: 'good',
        title: 'Powder Blue printed T-shirt hats',
        designerName: 'BLUE ROSES',
        url: '/products/1063873?gender=womens',
        ESP_CategoryTitles: 'Womens',
        colour: 'RED',
        categories: 'Shoes test Loafers',
      },
      {
        sku: 'good',
        title: 'Ballerina suede hats pumps blue',
        designerName: 'Mansur Gavriel',
        url: '/products/1063874?gender=womens',
        ESP_CategoryTitles: 'Womens',
        colour: 'PINK',
        categories: 'Shoes Heels Pumps',
      },
      {
        sku: 'good',
        title: 'Ballerina suede pumps',
        designerName: 'Mansur Gavriel',
        url: '/products/1063874?gender=womens',
        ESP_CategoryTitles: 'Womens',
        colour: 'blue',
        categories: 'hat Shoes Heels Pumps blue',
      }];

      expect(justin.search(dataWithBothSearchTerms, 'Blue Hat'))
              .to.be.an('array')
              .to.be.length(3)
              .to.deep.equal(expected);
    });

    it('should work with special characters', () => {
      const dataWithSpecialChar = [
        {
          sku: 'good',
          title: '밴드 칼라 자수 빕 리넨 셔츠',
          designerName: '120% Lino',
          url: '/products/1063873?gender=womens',
          ESP_CategoryTitles: 'Womens',
          colour: 'RED',
          categories: 'Shoes test Loafers',
        },
        {
          sku: 'good',
          title: 'Ballerina suede hats pumps blue',
          designerName: 'Mansur Gavriel',
          url: '/products/1063874?gender=womens',
          ESP_CategoryTitles: 'Womens',
          colour: 'PINK',
          categories: 'Shoes Heels Pumps',
        }];

      const expected = [{
        sku: 'good',
        title: '밴드 칼라 자수 빕 리넨 셔츠',
        designerName: '120% Lino',
        url: '/products/1063873?gender=womens',
        ESP_CategoryTitles: 'Womens',
        colour: 'RED',
        categories: 'Shoes test Loafers',
      }];

      expect(justin.search(dataWithSpecialChar, '120%'))
              .to.be.an('array')
              .to.be.length(1)
              .to.deep.equal(expected);

      expect(justin.search(dataWithSpecialChar, '밴드 칼라 자수 빕 리넨 셔츠'))
              .to.be.an('array')
              .to.be.length(1)
              .to.deep.equal(expected);

    });
  });
});
