(function() {

  window.lino_reader_minll = function(txt) {
    var header, lino, rows, sentences;
    lino = {
      metadata: {},
      content: [
        {
          type: 'splitter',
          level: 'document',
          terminator: 'begin'
        }
      ]
    };
    rows = txt.split('\n\n');
    header = rows[0];
    sentences = rows.slice(1);
    sentences.forEach(function(sentence, i) {
      var parsed_sentence;
      parsed_sentence = d3.tsv.parse(header + '\n' + sentence);
      parsed_sentence.forEach(function(token) {
        lino.content.push({
          type: 'token',
          text: token.token,
          lemma: token.lemma,
          pos: token.pos
        });
        return lino.content.push({
          type: 'gap',
          text: ' '
        });
      });
      if (i < sentences.length - 1) {
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
