(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define('foreigner', [], factory);
    }
    else {
        root.foreigner = factory();
    }
}(this, function() {

var foreigner;

var lookupKey = function(keyPath) {
  var value = null;

  if (keyPath.indexOf('.') != -1) {
    var paths = keyPath.split('.');
    value = foreigner.translations[foreigner.locale];

    for (var i=0, l=paths.length; i<l; i++) {
      var path = paths[i];
      if (typeof value == 'object' && path in value) {
        value = value[path];
      } else {
        value = null;
        break;
      }
    }

  } else {
    value = foreigner.translations[foreigner.locale][keyPath];
  }

  return value ? value : null;
};

var parse = (function() {
  var tokenRegexp = /(?:\{([a-z0-9_\$]+)\s*,\s*(select|plural)\s*,\s*((?:\w+\s*\{[^\}]+\}(?:\s*)?)+)\})|(?:\{([a-z0-9_\$]+)\})/gi;
  var choicesRegexp = /(\w+)(?:\s*)?\{([^\}]+)\}/gi;

  return function(string) {
    var result, tokens = [];

    while ((result = tokenRegexp.exec(string)) !== null) {

      // The token regexp has 2 branches, the first for select/plural, the second for simple interpolation
      // The 5th capture group is part of the second branch so we know for sure that if it’s not defined
      // it’s not an interpolation
      var token;

      if (!result[4]) {
        token = {
          toReplace: result[0],
          key: result[1],
          action: result[2],
          choices: {}
        };

        var choiceResult;
        while ((choiceResult = choicesRegexp.exec(result[3])) !== null) {
          token.choices[choiceResult[1]] = choiceResult[2];
        }

        choicesRegexp.lastIndex = 0;
        tokens.push(token);

      } else {
        token = {
          toReplace: result[0],
          action: 'interpolation',
          key: result[4]
        };

        tokens.push(token);
      }

      choicesRegexp.lastIndex = 0;
    }

    tokenRegexp.lastIndex = 0;
    return tokens;
  };
})();

var compile = function(string, tokens) {

  return function(data) {

    for (var i=0, l=tokens.length; i<l; i++) {
      var value;
      var token = tokens[i];

      if (data[token.key] == null) data[token.key] = '';

      switch (token.action) {
      case 'select':
        value = token.choices[data[token.key]] || token.choices.other;
        break;

      case 'plural':
        var numberMap = {
          '0': 'zero',
          '1': 'one',
          '2': 'two'
        };

        // We have the key, or the key corresponds to a number in the map, or we don’t have it
        value = token.choices[data[token.key]] || token.choices[numberMap[data[token.key]]] || token.choices.other;
        value = value.replace('#', data[token.key]);
        break;

      case 'interpolation':
        value = data[token.key];
        break;
      }

      string = string.replace(token.toReplace, value);
    }

    return string;
  };
};

foreigner = {

  locale: '',
  translations: {},

  t: function(key, attrs) {
    if (typeof attrs != 'object') attrs = {};

    if (!foreigner.locale) {
      throw new Error('[foreigner] You tried to lookup a translation before setting a locale.');
    }

    var string = lookupKey(key);
    if (!string) return null;

    while (typeof string == 'string' && string.charAt(0) == '!') {
      string = lookupKey(string.slice(1));
    }

    if (Object.keys(attrs).length === 0) {
      return string;
    } else {
      var tokens = parse(string);
      var compiledString = compile(string, tokens);
      return compiledString(attrs);
    }
  }
};

    return foreigner;
}));
