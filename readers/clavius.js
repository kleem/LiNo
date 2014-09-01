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
    var lino;
    lino = {
      metadata: {
        title: 'none'
      },
      content: [
        {
          type: 'splitter',
          level: 'document',
          terminator: 'begin'
        }
      ]
    };
    data.sentences.sentence.forEach(function(sentence, i) {
      sentence.token.forEach(function(token) {
        lino.content.push({
          type: 'token',
          text: token.text,
          lemma: token.lemma,
          pos: convert_pos(token.morphoCode)
        });
        return lino.content.push({
          type: 'gap',
          text: ' '
        });
      });
      if (i < data.sentences.sentence.length - 1) {
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
