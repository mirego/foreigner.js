
describe('Interpolations', function() {

  describe('Plurals', function() {

    beforeEach(function() {
      foreigner.locale = 'en';
      foreigner.translations.en = {
        found_coins: 'You found {coinsCount, plural, zero{# coins} one{one coin} two{two coins} other{# coins}}.',
        skill_points: 'You have {skillPoints, plural, 2{2 skill points} two{two skill points} 4{four skill points}} to spend.',
        found_gems: 'You found {gemsCount, plural, other{gems}}.'
      };
    });

    afterEach(function() {
      foreigner.locale = '';
      foreigner.translations = {};
    });

    it('should be able to match `zero` given a value of 0', function() {
      expect(foreigner.t('found_coins', {coinsCount: 0})).toEqual('You found 0 coins.');
    });

    it('should be able to match `one` given a value of 1', function() {
      expect(foreigner.t('found_coins', {coinsCount: 1})).toEqual('You found one coin.');
    });

    it('should be able to match `two` given a value of 2', function() {
      expect(foreigner.t('found_coins', {coinsCount: 2})).toEqual('You found two coins.');
    });

    it('should be able to match any specific number given the exact value of the number', function() {
      expect(foreigner.t('skill_points', {skillPoints: 4})).toEqual('You have four skill points to spend.');
    });

    it('should be able to match 0, 1 and 2, and override the named key given the same number and named key are specified', function() {
      expect(foreigner.t('skill_points', {skillPoints: 2})).toEqual('You have 2 skill points to spend.');
    });

    it('should be able to fall back to `other` when the value doesn’t match any choice', function() {
      expect(foreigner.t('found_coins', {coinsCount: 3})).toEqual('You found 3 coins.');
    });

    it('should be able to match `other` when no other choice is defined', function() {
      expect(foreigner.t('found_gems', {gemsCount: 1})).toEqual('You found gems.');
    });

  });

  describe('Selects', function() {

    beforeEach(function() {
      foreigner.locale = 'en';
      foreigner.translations.en = {
        the_cake_is: 'The cake is {opinion, select, good{good} bad{bad} other{a lie}}.'
      };
    });

    afterEach(function() {
      foreigner.locale = '';
      foreigner.translations = {};
    });

    it('should be able to match a choice', function() {
      expect(foreigner.t('the_cake_is', {opinion: 'good'})).toEqual('The cake is good.');
    });

    it('should be able to fall back to `other` when the value doesn’t match any choice', function() {
      expect(foreigner.t('the_cake_is', {opinion: 'dont_know'})).toEqual('The cake is a lie.');
    });

  });

});
