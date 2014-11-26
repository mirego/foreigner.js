describe('Parsing', function() {
  describe('Replacement', function() {
    beforeEach(function() {
      foreigner.locale = 'en';
    });

    afterEach(function() {
      foreigner.locale = '';
      foreigner.translations = {};
    });

    it('should output the string as-is when parameters aren’t passed', function() {
      foreigner.translations.en = {
        test_1: 'Hello, {name}.'
      };

      expect(foreigner.t('test_1')).toEqual('Hello, {name}.');
    });

    it('should output the string with an empty string replacing variables when passing an empty object', function() {
      foreigner.translations.en = {
        test_1: 'Hello, {name}.'
      };

      expect(foreigner.t('test_1', {})).toEqual('Hello, .');
    });

    it('should allow you to escape { and } characters', function() {
      foreigner.translations.en = {
        test_1: '\{test',
        test_2: 'test\}',
        test_3: '\{test\}'
      };

      expect(foreigner.t('test_1')).toEqual('{test');
      expect(foreigner.t('test_2')).toEqual('test}');
      expect(foreigner.t('test_3')).toEqual('{test}');
    });

    it('should gracefully handle quotes (since it ends up in a JS String)', function() {
      foreigner.translations.en = {
        test_1: 'This is a dbl quote: "',
        test_2: "This is a single quote: '"
      };

      expect(foreigner.t('test_1')).toEqual('This is a dbl quote: "');
      expect(foreigner.t('test_2')).toEqual("This is a single quote: '");
    });

    it('should not care about whitespace in a variable', function() {
      foreigner.translations.en = {
        test_1: '{test }',
        test_2: '{ test}',
        test_3: '{test  }',
        test_4: '{  test}',
        test_5: '{test}'
      };

      expect(foreigner.t('test_1', {test: 'Hello'})).toEqual('Hello');
      expect(foreigner.t('test_2', {test: 'Hello'})).toEqual('Hello');
      expect(foreigner.t('test_3', {test: 'Hello'})).toEqual('Hello');
      expect(foreigner.t('test_4', {test: 'Hello'})).toEqual('Hello');
      expect(foreigner.t('test_5', {test: 'Hello'})).toEqual('Hello');
    });

    it('should maintain exact strings - not affected by variables', function() {
      foreigner.translations.en = {
        test_1: 'x{test}',
        test_2: '\n{test}',
        test_3: ' {test}',
        test_4: 'x { test}',
        test_5: 'x{test} x ',
        test_6: 'x\n{test}\n'
      };

      expect(foreigner.t('test_1', {test: 'Hello'})).toEqual('xHello');
      expect(foreigner.t('test_2', {test: 'Hello'})).toEqual('\nHello');
      expect(foreigner.t('test_3', {test: 'Hello'})).toEqual(' Hello');
      expect(foreigner.t('test_4', {test: 'Hello'})).toEqual('x Hello');
      expect(foreigner.t('test_5', {test: 'Hello'})).toEqual('xHello x ');
      expect(foreigner.t('test_6', {test: 'Hello'})).toEqual('x\nHello\n');
    });

    it('should handle extended character literals', function() {
      foreigner.translations.en = {
        test_1: '☺{test}',
        test_2: '中{test}中国话不用彁字。😁'
      };

      expect(foreigner.t('test_1', {test: 'Hello'})).toEqual('☺Hello');
      expect(foreigner.t('test_2', {test: 'Hello'})).toEqual('中Hello中国话不用彁字。😁');
    });

    it('shouldn’t matter if it has html or something in it', function() {
      foreigner.translations.en = {
        test_1: '<div class="test">content: {test}</div>'
      };

      expect(foreigner.t('test_1', {test: 'Hello'})).toEqual('<div class="test">content: Hello</div>');
    });

    it('should return the string with an empty string as the replacement if the variable provided is null', function() {
      foreigner.translations.en = {
        greet: 'Hello, {name}'
      };

      expect(foreigner.t('greet', {name: null})).toEqual('Hello, ');
    });
  });

  describe('Selects', function() {
    beforeEach(function() {
      foreigner.locale = 'en';
    });

    afterEach(function() {
      foreigner.locale = '';
      foreigner.translations = {};
    });

    it('should be very whitespace agnostic', function() {
      foreigner.translations.en = {
        test_1: '{VAR, select, key{a} other{b}}',
        test_2: '{VAR,select,key{a}other{b}}',
        test_3: '{    VAR   ,    select   ,    key      {a}   other    {b}    }',
        test_4: '{ \n   VAR  \n , \n   select  \n\n , \n \n  key \n    \n {a}  \n other \n   {b} \n  \n }',
        test_5: '{ \t  VAR  \n , \n\t\r  select  \n\t , \t \n  key \n    \t {a}  \n other \t   {b} \t  \t }'
      };

      expect(foreigner.t('test_1', {VAR: null})).toEqual('b');
      expect(foreigner.t('test_2', {VAR: null})).toEqual('b');
      expect(foreigner.t('test_3', {VAR: null})).toEqual('b');
      expect(foreigner.t('test_4', {VAR: null})).toEqual('b');
      expect(foreigner.t('test_5', {VAR: null})).toEqual('b');
    });

    it('should allow you to use keywords in other places, including in select keys', function() {
      foreigner.translations.en = {
        test_1: 'x {TEST, select, select{a} other{b} }',
        test_2: 'x {TEST, select, TEST{a} other{b} }'
      };

      // use `select` as a select key
      expect(foreigner.t('test_1', {TEST: 'select'})).toEqual('x a');
      // use the exact variable name as a key name
      expect(foreigner.t('test_2', {TEST: 'TEST'})).toEqual('x a');
    });
  });

  describe('Plurals', function() {
    beforeEach(function() {
      foreigner.locale = 'en';
    });

    afterEach(function() {
      foreigner.locale = '';
      foreigner.translations = {};
    });

    it('should be very whitespace agnostic', function () {
      foreigner.translations.en = {
        test_1: '{ NUM, plural, one{1} other{2} }',
        test_2: '{NUM,plural,one{1}other{2}}',
        test_3: '{\nNUM,   \nplural,\n   one\n\n{1}\n other {2}\n\n\n}',
        test_4: '{\tNUM\t,\t\t\r plural\t\n, \tone\n{1}    other\t\n{2}\n\n\n}'
      };

      expect(foreigner.t('test_1', {NUM: 1})).toEqual('1');
      expect(foreigner.t('test_2', {NUM: 1})).toEqual('1');
      expect(foreigner.t('test_3', {NUM: 1})).toEqual('1');
      expect(foreigner.t('test_4', {NUM: 1})).toEqual('1');
    });

    it('should be able to match `zero` given a value of 0', function() {
      foreigner.translations.en = {
        found_coins: 'You found {coinsCount, plural, zero{# coins} one{one coin} two{two coins} other{# coins}}.',
      };

      expect(foreigner.t('found_coins', {coinsCount: 0})).toEqual('You found 0 coins.');
    });

    it('should be able to match `one` given a value of 1', function() {
      foreigner.translations.en = {
        found_coins: 'You found {coinsCount, plural, zero{# coins} one{one coin} two{two coins} other{# coins}}.',
      };

      expect(foreigner.t('found_coins', {coinsCount: 1})).toEqual('You found one coin.');
    });

    it('should be able to match `two` given a value of 2', function() {
      foreigner.translations.en = {
        found_coins: 'You found {coinsCount, plural, zero{# coins} one{one coin} two{two coins} other{# coins}}.',
      };

      expect(foreigner.t('found_coins', {coinsCount: 2})).toEqual('You found two coins.');
    });

    it('should be able to match any specific number given the exact value of the number', function() {
      foreigner.translations.en = {
        skill_points: 'You have {skillPoints, plural, 2{2 skill points} two{two skill points} 4{four skill points}} to spend.',
      };

      expect(foreigner.t('skill_points', {skillPoints: 4})).toEqual('You have four skill points to spend.');
    });

    it('should be able to match 0, 1 and 2, and override the named key given the same number and named key are specified', function() {
      foreigner.translations.en = {
        skill_points: 'You have {skillPoints, plural, 2{2 skill points} two{two skill points} 4{four skill points}} to spend.',
      };

      expect(foreigner.t('skill_points', {skillPoints: 2})).toEqual('You have 2 skill points to spend.');
    });

    it('should be able to fall back to `other` when the value doesn’t match any choice', function() {
      foreigner.translations.en = {
        found_coins: 'You found {coinsCount, plural, zero{# coins} one{one coin} two{two coins} other{# coins}}.',
      };

      expect(foreigner.t('found_coins', {coinsCount: 3})).toEqual('You found 3 coins.');
    });

    it('should be able to match `other` when no other choice is defined', function() {
      foreigner.translations.en = {
        found_gems: 'You found {gemsCount, plural, other{gems}}.'
      };

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
