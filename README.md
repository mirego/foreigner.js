# Foreigner.js

[![Bower version](https://badge.fury.io/bo/foreigner.js.svg)](http://badge.fury.io/bo/foreigner.js)
[![Build Status](http://img.shields.io/travis/mirego/foreigner.js.svg)](https://travis-ci.org/mirego/foreigner.js)
[![Coverage Status](http://img.shields.io/coveralls/mirego/foreigner.js/master.svg)](https://coveralls.io/r/mirego/foreigner.js?branch=master)
[![Code Climate](http://img.shields.io/codeclimate/github/mirego/foreigner.js.svg)](https://codeclimate.com/github/mirego/foreigner.js)

`Foreigner` is a JavaScript library that will help you with translations.

## Usage

### Setting the locale

```js
foreigner.locale = 'fr-CA';
```

### Defining and retreiving translations:

```js
foreigner.translations['fr-CA'] = {
  good_day: 'Bonjour.'
};

foreigner.t('good_day');
// => 'Bonjour.'
```

### Interpolations:

```js
foreigner.translations['fr-CA'] = {
  good_day_name: 'Bonjour {name}.'
};

foreigner.t('good_day_name', {name: 'Walter'});
// => 'Bonjour Walter.'
```

### Plurals and switches

Plurals and switches are defined with a special syntax:

```js
{<value>, <plural or select>, <choiceKey>{<textForChoice>}} 
```

Here there is only one choice but you can define several if needed.  
The only __required__ choice is `other`.

#### Plurals

The pluralization accepts a few keys as choices (in order of precedence):

- any specific number e.g. `23`
- `zero` / `one` / `two`
- `other`

```js
foreigner.translations['fr-CA'] = {
  x_people_liked_this: '{likesCount, plural, zero{Personne n’a} one{Une personne a} two{Deux personnes} 23{22 personnes et Walter Sparrow} other{# personnes ont}} aimé ça.'
};

foreigner.t('x_people_liked_this', {likesCount: 3});
// => 3 personnes ont aimé ça.
```

#### Switches

Switches are often used for selecting a gender in a string, but you can put almost anything you want as a `choiceKey`.

```js
foreigner.translations['fr-CA'] = {
  good_day_to_you: 'Bonjour à vous {gender, select, male{monsieur} female{madame}}.',
  the_cake_is: 'Le gâteau est {opinion, select, good{bon} bad{mauvais} other{un mensonge}}.'
};

foreigner.t('good_day_to_you', {gender: 'female'});
// => Bonjour à vous madame.

foreigner.t('the_cake_is', {opinion: 'dont_know'});
// => Le gâteau est un mensonge.
```

### Using multiple interpolations, plurals and selects

You can of course mix and match all of the above in the same string.

```js
foreigner.translations['fr-CA'] = {
  x_found_x_results_in_x_categories: '{gender, select, male{Il} female{Elle} other{Il}} a trouvé ' +
    '{resultsCount, plural, one{1 résultat} other{# résultats}} dans' +
    '{categoriesCount, plural, one {1 catégorie} other {# catégories}}.'
};

foreigner.t('x_found_x_results_in_x_categories', {gender: 'male', resultsCount: 4, categoriesCount: 1});
// => Il a trouvé 4 résultats dans 1 catégorie.
```

### Key paths and aliases

Aliases are must be preceded by a `!`

```js
foreigner.translations['en-US'] = {
  home_page: {
    header: {
      tagline: 'Have fun and don’t take life too seriously.'
    },
    footer: {
      tagline: '!home_page.header.tagline'
    }
  }
};

foreigner.t('home_page.footer.tagline');
// => Have fun and don’t take life too seriously.
```

## Inspiration

`Foreigner` was inspired by [MessageFormat.js](https://github.com/SlexAxton/messageformat.js) by [Alex Sexton](https://github.com/SlexAxton/).

`Foreigner` is however not a drop-in replacement, it’s doesn’t have as much features as MessageFormat, and that is by design.

Should you need more complex pluralization rules or nested expressions, I strongly suggest you take a look at it.

## License

`Foreigner` is © 2013-2014 [Mirego](http://www.mirego.com) and may be freely distributed under the [New BSD license](http://opensource.org/licenses/BSD-3-Clause).  
See the [`LICENSE.md`](https://github.com/mirego/foreigner.js/blob/master/LICENSE.md) file.

## About Mirego

[Mirego](http://mirego.com) is a team of passionate people who believe that work is a place where you can innovate and have fun. We're a team of [talented people](http://life.mirego.com) who imagine and build beautiful Web and mobile applications. We come together to share ideas and [change the world](http://mirego.org).

We also [love open-source software](http://open.mirego.com) and we try to give back to the community as much as we can.
