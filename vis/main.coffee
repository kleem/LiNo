# create a new lino container for the given lino data and d3 selection
window.lino_vis_main_new = (lino, selection) ->
    selection.datum(lino)
    
    selection
        .style
            'position': 'relative'
        .attr
            class: 'lino'
            
    svg = selection.append('svg')
        .style
            'position': 'absolute'
            
    html = selection.append('div')
        .style
            'position': 'relative'
            'pointer-events': 'none' # this is needed to have svg events work
    
    # create symbol definitions
    defs = svg.append('defs')
    defs.html '''
        <path id="pos_noun" d="m -3,-3 6,0 0,6 -6,0 z"/>
        <path id="pos_verb" d="M -3,-4 4,0 -3,4 z"/>
        <path id="pos_adjective" d="m -3,-3 0,6 6,0 0,-6 z m 2,2 2,0 0,2 -2,0 z"/>
        <path id="pos_adverb" d="M -3 -4 L -3 4 L 4 0 L -3 -4 z M -1.4375 -1.5 L 1.1875 0 L -1.4375 1.5 L -1.4375 -1.5 z"/>
        <path id="pos_pronoun" d="M -3 -3 L -3 -1 L -1 -1 L -1 -3 L -3 -3 z M 1 -3 L 1 -1 L 3 -1 L 3 -3 L 1 -3 z M -3 1 L -3 3 L -1 3 L -1 1 L -3 1 z M 1 1 L 1 3 L 3 3 L 3 1 L 1 1 z"/>
        <path id="pos_preposition" d="m -1,-6 0,5 2,0 2,0 0,-2 -2,0 0,-3 z"/>
        <path id="pos_determiner" d="m -1,-6 0,5 2,0 0,-5 z"/>
        <path id="pos_conjunction" d="m -1,-6 0,3 -2,0 0,2 2,0 0,2 2,0 0,-2 2,0 0,-2 -2,0 0,-3 z"/>
        <path id="pos_participle" d="M 0 -4.25 L -4.25 0 L 0 4.25 L 4.25 0 L 0 -4.25 z M 0 -1.40625 L 1.40625 0 L 0 1.40625 L -1.40625 0 L 0 -1.40625 z"/>
        <path id="pos_other" d="m -1,-6 0,2 2,0 0,-2 z"/>
    '''
    
    return selection
    
    
# redraw a lino container
window.lino_vis_main_redraw = (selection) ->
    html = selection.select('div')
    svg = selection.select('svg')
    
    # represent items as spans
    items = html.selectAll('.item')
        .data((lino) -> lino.content)
        
    # ENTER
    
    entered_spans = items.enter().append('span')
        .attr
            class: (item) -> "item #{item.type}"
        
    # tokens must have a ruby element, to support textual annotations that grow the item's bounding box (e.g. lemma)
    entered_spans.filter((item) -> item.type is 'token').append('ruby').append('rb')
    
    # UPDATE
    
    items.filter((item) -> item.type is 'token' and item.text?).selectAll('ruby > rb')
        .html (item) ->
            # replace breaking characters to avoid a line break inside the token
            return item.text
                .replace(new RegExp(' ', 'g'), '&nbsp;')
                .replace(new RegExp('-', 'g'), '&#8209;') # non-breaking hyphen
                
    items.filter((item) -> item.type isnt 'token' and item.text?)
        .html (item) -> item.text
        
    # adpat the svg to the div
    html_bbox = html.node().getBoundingClientRect()
    svg
        .attr
            width: html_bbox.width
            height: html_bbox.height
            
    # store the bounding box of span elements in each datum, so that they can be accessed when updating the svg
    items.each (item) ->
        # compute bounding boxes relative to the div
        client_rect = this.getBoundingClientRect()
        item.bbox = {
            left: client_rect.left - html_bbox.left,
            right: client_rect.right - html_bbox.left,
            top: client_rect.top - html_bbox.top,
            bottom: client_rect.bottom - html_bbox.top,
            width: client_rect.width,
            height: client_rect.height
        }
            
    return selection
    