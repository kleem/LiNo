(function() {
  var convert_pos;

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

  window.lino_reader_clavius = function(data) {
    /* index uri references to tokens
    */
    var lino, token, tokens_index, _i, _len, _ref;
    tokens_index = {};
    _ref = data.tokenization.token;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      token = _ref[_i];
      tokens_index[token.uri] = token;
    }
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
      ]
    };
    data.linguisticAnalysis.sentence.forEach(function(sentence, i) {
      sentence.token.forEach(function(token) {
        lino.content.push({
          type: 'token',
          text: token.uri in tokens_index ? tokens_index[token.uri].text : '!ERROR',
          lemma: token.lemma,
          pos: convert_pos(token.morphoCode)
        });
        lino.content.push({
          type: 'gap',
          text: ' '
        });
        if (!(token.uri in tokens_index)) {
          return console.warn('!ERROR - URI not found: ' + token.uri);
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
    return lino;
  };

}).call(this);
