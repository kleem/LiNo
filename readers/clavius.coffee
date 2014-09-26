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
        
convert_class = (klass) ->
    return switch klass
        when 'Person' then 'person'
        when 'Group' then 'organization'
        when 'Location' then 'place'
        when 'Time' then 'time'
        when 'Work' then 'work'
        when 'Manifestation' then 'work'
        when 'Manifestation_singleton' then 'work'
        else 'other'
        
window.lino_reader_clavius = (data) ->
    # index uri references to tokens
    tokens_index = {}
    for token in data.tokenization.token
        tokens_index[token.uri] = token
        
    # index LiNo tokens
    lino_tokens_index = {}
    
    lino = {
        metadata: {
            title: data.title
        },
        content: [{
            type: 'splitter',
            level: 'document',
            terminator: 'begin'
        }],
        entities: []
    }
    
    # for each sentence in linguistic analysis
    data.linguisticAnalysis.sentence.forEach (sentence, i) ->
        # for each token
        sentence.token.forEach (token) ->
            # append a new token
            t = {
                type: 'token',
                text: if token.uri of tokens_index then tokens_index[token.uri].text else '!ERROR', # resolve the REF
                lemma: token.lemma,
                pos: convert_pos(token.morphoCode)
            }
            lino.content.push t
            # the Clavius format does not preserve spacing, so let's append a phony space
            lino.content.push {
                type: 'gap',
                text: ' '
            }
            
            if token.uri not of tokens_index
                console.warn '!ERROR - linguistic analysis - URI not found: ' + token.uri
            else
                lino_tokens_index[token.uri] = t # save into lino tokens index (entities must be able to point to tokens)
                
        # add a sentence splitter (if this is not the last sentence)
        if i < data.linguisticAnalysis.sentence.length - 1
            lino.content.push {
                type: 'splitter',
                level: 'sentence'
            }
           
    lino.content.push {
        type: 'splitter',
        level: 'document',
        terminator: 'end'
    }
    
    # for each entity in lexico-semantic analysis
    for entity in data.lexicoSemanticAnalysis.entity.filter((e) -> e.class isnt 'Lexical_entry')
        e = {
            class: convert_class(entity.class),
            original_class: entity.class,
            individual: entity.individual,
            tokens: []
        }
        # resolve the REFs
        if entity.object instanceof Array
            object = entity.object
        else
            object = [entity.object]
        for urio in object
            if urio.uri of lino_tokens_index
                e.tokens.push lino_tokens_index[urio.uri]
            else
                console.warn '!ERROR - lexico-semantic analysis - URI not found: ' + urio.uri
                
        lino.entities.push e
        
    return lino
    
