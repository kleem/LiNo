convert_pos = (morpho_code) ->
    return switch morpho_code[0]
        when 'n' then 'noun'
        when 'v' then 'verb'
        when 'a' then 'adjective'
        when 'd' then 'adverb'
        when 'p' then 'pronoun'
        when 'r' then 'preposition'
        # determiner is not defined in Clavius format
        when 'c' then 'conjunction'
        when 't' then 'participle'
        
        # FIXME? these are not yet defined in LiNo
        when 'm' then 'numeral'
        when 'i' then 'interjection'
        when 'e' then 'exclamation'
        
window.lino_reader_clavius = (data) ->
    lino = {
        metadata: {
            title: data.title
        },
        content: [{
            type: 'splitter',
            level: 'document',
            terminator: 'begin'
        }]
    }
    
    # for each sentence
    data.sentences.sentence.forEach (sentence, i) ->
        # for each token
        sentence.token.forEach (token) ->
            # append a new token
            lino.content.push {
                type: 'token',
                text: token.text,
                lemma: token.lemma,
                pos: convert_pos(token.morphoCode)
            }
            # the Clavius format does not preserve spacing, so let's append a phony space
            lino.content.push {
                type: 'gap',
                text: ' '
            }
            
        # add a sentence splitter (if this is not the last sentence)
        if i < data.sentences.sentence.length - 1
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
    