window.lino_reader_minll = (txt) ->
    lino = {
        metadata: {},
        content: [{
            type: 'splitter',
            level: 'document',
            terminator: 'begin'
        }]
    }
    
    # in MINLL (as in CONLL), sentences are separated by a blank row
    rows = txt.split('\n\n')
    # the first row contains the header
    header = rows[0]
    sentences = rows[1..]
    
    # for each sentence
    sentences.forEach (sentence, i) ->
        # in order to use d3.tsv.parse, the header must be defined for each sentence
        parsed_sentence = d3.tsv.parse header+'\n'+sentence
        
        # for each token
        parsed_sentence.forEach (token) ->
            # append a new token
            lino.content.push {
                type: 'token',
                text: token.token,
                lemma: token.lemma,
                pos: token.pos
            }
            # MINLL does not preserve spacing, so let's append a phony space
            lino.content.push {
                type: 'gap',
                text: ' '
            }
            
        # add a sentence splitter (if this is not the last sentence)
        if i < sentences.length - 1
            lino.content.push {
                type: 'splitter',
                level: 'sentence'
            }
           
    lino.content.push {
        type: 'splitter',
        level: 'document',
        terminator: 'end'
    }
    
    return lino
    
