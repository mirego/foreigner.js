var foreigner;

var WHITESPACE = '\\s*';
var IDENTIFIER = '[a-z0-9_\\$]+';

var SWITCHES_REGEXP = '' +
'\\{' + WHITESPACE +
  '(' + IDENTIFIER + ')' + WHITESPACE + ',' + WHITESPACE +
  '(select|plural)' + WHITESPACE + ',' + WHITESPACE +
  '((?:\\w+' + WHITESPACE + '\\{[^\\}]+\\}' + WHITESPACE + ')+)' +
'\\}';

var INTERPOLATION_REGEXP = '\\{' + WHITESPACE + '(' + IDENTIFIER + ')' + WHITESPACE + '\\}';

var TOKEN_REGEXP = new RegExp('(?:' + SWITCHES_REGEXP + ')|(?:' + INTERPOLATION_REGEXP + ')', 'gi');
var CHOICES_REGEXP = new RegExp('(\\w+)' + WHITESPACE + '\\{([^\\}]+)\\}', 'gi');

var NUMBER_MAP = {
  '0': 'zero',
  '1': 'one',
  '2': 'two'
};

var lookupKey = function(key, locale) {
  var string = (key.indexOf('.') >= 0) ? lookupKeyPath(key, locale) : lookupSimpleKey(key, locale);
  return (string) ? lookupAlias(string, locale) : null;
};

var lookupKeyPath = function(keyPath, locale) {
  var paths = keyPath.split('.');
  var value = foreigner.translations[locale];

  var index = 0;
  while (index < paths.length && value) {
    var path = paths[index];
    value = (typeof value === 'object' && path in value) ? value[path] : null;
    index++;
  }

  return value;
};

var lookupSimpleKey = function(key, locale) {
  return foreigner.translations[locale][key];
};

var lookupAlias = function(string, locale) {
  while (typeof string === 'string' && string.charAt(0) === '!') {
    string = lookupKey(string.slice(1), locale);
  }

  return string;
};

var parse = function(string) {
  var result;
  var tokens = [];

  while ((result = TOKEN_REGEXP.exec(string)) !== null) {
    // The token regexp has 2 branches, the first for select/plural, the second for simple interpolation
    // The 5th capture group is part of the second branch so we know for sure that if it’s defined
    // it’s an interpolation
    var token = {
      toReplace: result[0],
      action: '',
      key: '',
      choices: {}
    };

    if (result[4]) {
      token.action = 'interpolation';
      token.key = result[4];
    } else {
      token.key = result[1];
      token.action = result[2];

      var choiceResult;
      while ((choiceResult = CHOICES_REGEXP.exec(result[3])) !== null) {
        token.choices[choiceResult[1]] = choiceResult[2];
      }
    }

    tokens.push(token);
  }

  CHOICES_REGEXP.lastIndex = 0;
  TOKEN_REGEXP.lastIndex = 0;

  return tokens;
};

var compile = function(string, tokens, data) {
  // jshint maxcomplexity:9
  for (var index = 0, length = tokens.length; index < length; index++) {
    var value;
    var token = tokens[index];
    var dataValue = data[token.key] == null ? '' : data[token.key];

    switch (token.action) {
    case 'interpolation':
      value = dataValue;
      break;

    case 'plural':
      // We have the key, or the key corresponds to a number in the map, or we don’t have it
      value = token.choices[dataValue] || token.choices[NUMBER_MAP[dataValue]] || token.choices.other;
      value = value.replace('#', dataValue);
      break;

    case 'select':
      value = token.choices[dataValue] || token.choices.other;
      break;
    }

    string = string.replace(token.toReplace, value);
  }

  return string;
};

foreigner = {
  locale: '',
  translations: {},

  t: function(key, attrs) {
    var locale = foreigner.locale;

    if (arguments.length === 2 && typeof attrs === 'string') {
      locale = attrs;
    } else if (arguments.length === 3) {
      locale = arguments[2];
    }

    if (!locale) {
      throw new Error('[foreigner] You tried to lookup a translation without setting a locale.');
    }

    var string = lookupKey(key, locale);

    if (!string) return null;

    if (typeof attrs !== 'object') {
      return string;
    } else {
      var tokens = parse(string);
      return compile(string, tokens, attrs);
    }
  }
};
