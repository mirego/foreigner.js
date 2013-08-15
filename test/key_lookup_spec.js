
describe('Key lookup', function() {

  beforeEach(function() {
    foreigner.locale = 'en';
    foreigner.translations.en = {
      greetings: 'Greetings!',
      level_one: {
        level_two: {
          level_three: {
            diablo: 'Diablo'
          }
        }
      },
      magic_portal: '!level_one.level_two.level_three.diablo',
      tristram_portal: '!magic_portal'
    };
  });

  afterEach(function() {
    foreigner.locale = '';
    foreigner.translations = {};
  });

  it('should throw an error if no locale is set', function() {
    foreigner.locale = '';
    expect(function() {foreigner.t('greetings'); }).toThrow();
  });

  it('should be able to lookup a key', function() {
    expect(foreigner.t('greetings')).toEqual('Greetings!');
  });

  it('should be able to lookup a key path', function() {
    expect(foreigner.t('level_one.level_two.level_three.diablo')).toEqual('Diablo');
  });

  it('should be able to lookup a key from an alias', function() {
    expect(foreigner.t('magic_portal')).toEqual('Diablo');
  });

  it('should be able to lookup a key from an alias recusively', function() {
    expect(foreigner.t('tristram_portal')).toEqual('Diablo');
  });

});
