(function() {

  window.lino_reader_minll = function(txt) {
    var header, lino, sentences;
    lino = {
      structure: 'document',
      content: []
    };
    sentences = txt.split('\n\n');
    header = sentences[0];
    sentences.slice(1).forEach(function(sentence) {
      var lino_sentence, parsed_sentence;
      parsed_sentence = d3.tsv.parse(header + '\n' + sentence);
      lino_sentence = {
        structure: 'sentence',
        content: []
      };
      lino.content.push(lino_sentence);
      return parsed_sentence.forEach(function(token) {
        lino_sentence.content.push({
          structure: 'token',
          text: token.token,
          lemma: token.lemma,
          pos: token.pos
        });
        return lino_sentence.content.push({
          structure: 'spacing',
          text: ' '
        });
      });
    });
    return lino;
  };

}).call(this);
