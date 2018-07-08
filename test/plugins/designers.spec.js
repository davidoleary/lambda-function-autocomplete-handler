import { expect } from 'chai';

import { designers } from '../../src/plugins';
import designersMensEn from '../mocks/autocomplete_designers-data_en_mens.json';
import designersWomensKo from '../mocks/autocomplete_designers-data_ko_womens.json';

describe('parsers', () => {
  describe('designers', () => {
    describe('parser', () => {
      it('should return data untouched if not valid json', () => {
        const expected = [
          'abc',
          'def',
        ];

        expect(designers.parser(expected))
          .to.deep.equal(expected);
      });

      it('should return object if json passed in', () => {
        const expected = {
          hello: 'dude',
        };

        expect(designers.parser([JSON.stringify(expected)]))
          .to.deep.equal([expected]);
      });
    });

    describe('search', () => {
      it('should find matches when a specifying search field', () => {
        const expected = [
          { designerName: 'Maison Kitsune',
            designerDoubleLocalizedName: '',
            url: '/mens/designers/maison-kitsune?is=Maison Kitsune',
          }, {
            designerName: 'Maison Margiela',
            designerDoubleLocalizedName: '',
            url: '/mens/designers/maison-martin-margiela?is=Maison Margiela',
          },
        ];

        expect(designers.search(designersMensEn, 'Maison'))
          .to.be.an('array')
          .to.be.length(2)
          .to.include.deep.members(expected);
      });

      it('should find matches when a specifying search field in korean data', () => {
        const expected = [{
          designerDoubleLocalizedName: '아담 리페스',
          designerName: 'Adam Lippes',
          url: '/womens/designers/adam-lippes?is=Adam Lippes',
        }];

        expect(designers.search(designersWomensKo, 'Lippes'))
          .to.be.an('array')
          .to.be.length(1)
          .to.include.deep.members(expected);
      });

      it('should find matches when a specifying search field in korean data with korean language', () => {
        const expected = [{
          designerDoubleLocalizedName: '아크네 스튜디오',
          designerName: 'Acne Studios',
          url: '/womens/designers/acne-studios?is=Acne Studios',
        }];

        expect(designers.search(designersWomensKo, 'Acne', 'ko'))
          .to.be.an('array')
          .to.be.length(1)
          .to.include.deep.members(expected);
      });

      it('should find matches when a specifying search field in korean data with korean language and korean search term', () => {
        const expected = [{
          designerDoubleLocalizedName: '아크네 스튜디오',
          designerName: 'Acne Studios',
          url: '/womens/designers/acne-studios?is=Acne Studios',
        }];

        expect(designers.search(designersWomensKo, '아크네 스튜디오', 'ko'))
          .to.be.an('array')
          .to.be.length(1)
          .to.include.deep.members(expected);
      });

      it('should find matches for each word in search term', () => {
        const expected = [{
          designerDoubleLocalizedName: '',
          designerName: 'Maison Kitsune',
          url: '/mens/designers/maison-kitsune?is=Maison Kitsune',
        }, {
          designerDoubleLocalizedName: '',
          designerName: 'Maison Margiela',
          url: '/mens/designers/maison-martin-margiela?is=Maison Margiela',
        }];

        expect(designers.search(designersMensEn, 'Maison Kitsune'))
          .to.be.an('array')
          .to.be.length(2)
          .to.deep.equal(expected);
      });

      it('should find matches for any word in search term', () => {
        const expected = [{
          designerDoubleLocalizedName: '',
          designerName: 'Massimo Alba',
          url: '/mens/designers/massimo-alba?is=Massimo Alba',
        }];

        expect(designers.search(designersMensEn, 'No match Alba'))
          .to.be.an('array')
          .to.be.length(1)
          .to.deep.equal(expected);
      });

      it('should find special characters', () => {
        const expected = [{
          designerDoubleLocalizedName: '',
          designerName: '120% Lino',
          url: '/mens/designers/120%Lino',
        }];

        expect(designers.search(designersMensEn, '120%', 'en'))
          .to.be.an('array')
          .to.be.length(1)
          .to.include.deep.members(expected);
      });

      it('should escape special characters', () => {
        const specialCharsData = [{
          designerDoubleLocalizedName: '',
          designerName: '120%| Lino',
          url: '/mens/designers/120%Lino',
        },
          {
            designerDoubleLocalizedName: '',
            designerName: '120% Lino',
            url: '/mens/designers/120%Lino',
          }];

        const expected = [{
          designerDoubleLocalizedName: '',
          designerName: '120%| Lino',
          url: '/mens/designers/120%Lino',
        }];

      expect(designers.search(specialCharsData, '120%|', 'en'))
              .to.be.an('array')
              .to.be.length(1)
              .to.include.deep.members(expected);
      });
    });
  });
});
