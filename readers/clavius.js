(function() {
  var convert_class, convert_pos;

  convert_pos = function(morpho_code) {
    switch (morpho_code[0]) {
      case 'n':
        return 'noun';
      case 'v':
        return 'verb';
      case 'a':
        return 'adjective';
      case 'd':
        return 'adverb';
      case 'p':
        return 'pronoun';
      case 'r':
        return 'preposition';
      case 'c':
        return 'conjunction';
      case 't':
        return 'participle';
      case 'm':
        return 'numeral';
      case 'i':
        return 'interjection';
      case 'e':
        return 'exclamation';
    }
  };

  convert_class = function(klass) {
    switch (klass) {
      case 'Person':
        return 'person';
      case 'Group':
        return 'organization';
      case 'Location':
        return 'place';
      case 'Time':
        return 'time';
      case 'Work':
        return 'work';
      case 'Manifestation':
        return 'work';
      case 'Manifestation_singleton':
        return 'work';
      default:
        return 'other';
    }
  };

  window.lino_reader_clavius = function(data) {
    var e, entity, lino, lino_tokens_index, object, token, tokens_index, urio, _i, _j, _k, _len, _len2, _len3, _ref, _ref2;
    tokens_index = {};
    _ref = data.tokenization.token;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      token = _ref[_i];
      tokens_index[token.uri] = token;
    }
    lino_tokens_index = {};
    lino = {
      metadata: {
        title: data.title
      },
      content: [
        {
          type: 'splitter',
          level: 'document',
          terminator: 'begin'
        }
      ],
      entities: []
    };
    data.linguisticAnalysis.sentence.forEach(function(sentence, i) {
      sentence.token.forEach(function(token) {
        var t;
        t = {
          type: 'token',
          text: token.uri in tokens_index ? tokens_index[token.uri].text : '!ERROR',
          lemma: token.lemma,
          pos: convert_pos(token.morphoCode)
        };
        lino.content.push(t);
        lino.content.push({
          type: 'gap',
          text: ' '
        });
        if (!(token.uri in tokens_index)) {
          return console.warn('!ERROR - linguistic analysis - URI not found: ' + token.uri);
        } else {
          return lino_tokens_index[token.uri] = t;
        }
      });
      if (i < data.linguisticAnalysis.sentence.length - 1) {
        return lino.content.push({
          type: 'splitter',
          level: 'sentence'
        });
      }
    });
    lino.content.push({
      type: 'splitter',
      level: 'document',
      terminator: 'end'
    });
    _ref2 = data.lexicoSemanticAnalysis.entity.filter(function(e) {
      return e["class"] !== 'Lexical_entry';
    });
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      entity = _ref2[_j];
      e = {
        "class": convert_class(entity["class"]),
        original_class: entity["class"],
        individual: entity.individual,
        tokens: []
      };
      if (entity.object instanceof Array) {
        object = entity.object;
      } else {
        object = [entity.object];
      }
      for (_k = 0, _len3 = object.length; _k < _len3; _k++) {
        urio = object[_k];
        if (urio.uri in lino_tokens_index) {
          e.tokens.push(lino_tokens_index[urio.uri]);
        } else {
          console.warn('!ERROR - lexico-semantic analysis - URI not found: ' + urio.uri);
        }
      }
      lino.entities.push(e);
    }
    return lino;
  };

}).call(this);
