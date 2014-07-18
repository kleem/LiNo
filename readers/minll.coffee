window.lino_reader_minll = (txt) ->
    lino = {
        structure: 'document',
        content: []
    }
    
    # in MINLL (as in CONLL), sentences are separated by a blank row
    sentences = txt.split('\n\n')
    # the first row contains the header
    header = sentences[0]
    
    # for each sentence
    sentences[1..].forEach (sentence) ->
        # in order to use d3.tsv.parse, the header must be defined for each sentence
        parsed_sentence = d3.tsv.parse header+'\n'+sentence
        
        # append a new sentence
        lino_sentence = {
            structure: 'sentence',
            content: []
        }
        lino.content.push lino_sentence
        
        # for each token
        parsed_sentence.forEach (token) ->
            # append a new token
            lino_sentence.content.push {
                structure: 'token',
                text: token.token,
                lemma: token.lemma,
                pos: token.pos
            }
            # MINLL does not preserve spacing, so let's append a phony space
            lino_sentence.content.push {
                structure: 'spacing',
                text: ' '
            }
        
    return lino
    