# visualization parameters
token_gap = 0 # distance between token underlines
token_dy = 1 # distance between text and token underlines
token_thickness = 1 # thickness of token and polarity underlines

pos_dx = 6.5
pos_dy = 8.5

splitter_height = 58
splitter_offset = 6

class_color = d3.scale.ordinal()
    .domain(['person','organization','place','work','time','other'])
    .range(['#E14E5F', '#A87621', '#43943E', '#AC5CC4', '#2986EC', '#7E7F7E']) # '#2E99A0' Species
    
window.lino_vis_default_new = (lino, container, title_container) ->
  # display the document title
  title_container.classed('lino_header', true)
  title_container.text lino.metadata.title
  
  # sort the entities to draw small ones above large ones
  lino.entities.sort((a, b) -> b.tokens.length - a.tokens.length)
  
  lino_vis_main_new(lino, container)
  lino_vis_default_redraw(container)
  
  window.onresize = () -> lino_vis_default_redraw(container)
  
window.lino_vis_default_redraw = (container) ->
  lino_vis_main_redraw(container)
  lino = container.datum()
  
  svg = container.select('svg')
  html = container.select('div')
  
  # token underline
  tokens = svg.selectAll('.token')
    .data(lino.content.filter((item) -> item.type is 'token'))
  
  tokens.enter().append('rect')
    .attr
      class: 'token'
  
  tokens
    .attr
      x: (item) -> item.bbox.left + token_gap/2
      y: (item) -> item.bbox.bottom + token_dy
      width: (item) -> item.bbox.width - token_gap
      height: token_thickness
      
  # lemma
  lemmas = html.selectAll('.token ruby').selectAll('rt')
    .data((token) -> [token])
    
  lemmas.enter().append('rt')
    .text((token) -> token.lemma)
      
  # pos symbols
  poss = svg.selectAll('.pos')
    .data(lino.content.filter((item) -> item.pos?))
  
  enter_poss = poss.enter().append('use')
    .attr
      class: 'pos'
  
  enter_poss.append('title')
    .text((item) -> item.pos)
    
  poss
    .attr
      'xlink:href': (item) -> "#pos_#{item.pos}"
      transform: (item) ->
        x = item.bbox.left + token_gap + pos_dx
        y = item.bbox.bottom + token_dy + token_thickness + pos_dy
        return "translate(#{x} #{y}) scale(1.5)"
      
  # splitters
  splitters = svg.selectAll('.splitter')
    .data(lino.content.filter((item) -> item.type is 'splitter'))
    
  splitters.enter().append('path')
    .attr
      class: 'splitter'
  
  splitters
    .attr
      d: (item) ->
        switch item.level
          when 'sentence' then "M#{item.bbox.left+item.bbox.width/2} #{item.bbox.top+item.bbox.height/2-splitter_height/2+splitter_offset} l0 #{splitter_height}"
          when 'document' then switch item.terminator
            when 'begin' then "M#{item.bbox.left+0.5} #{item.bbox.top+item.bbox.height/2-splitter_height/2+splitter_offset} l0 #{splitter_height} l2 0 l6 0 l-6 0 l0 #{-splitter_height} l12 0 z"
            when 'end' then "M#{item.bbox.right-0.5} #{item.bbox.top+item.bbox.height/2-splitter_height/2+splitter_offset} l0 #{splitter_height} l-2 0 l-12 0 l12 0  l0 #{-splitter_height} l-6 0 z"
  
  sentence_numbers = svg.selectAll('.sentence_number')
    .data(lino.content.filter((item) -> item.type is 'splitter' and item.terminator isnt 'end'))
    
  sentence_numbers.enter().append('text')
    .attr
      class: 'sentence_number'
  
  sentence_numbers
    .text((splitter, i) -> i+1) # one-based count
    .attr
      x: (item) -> item.bbox.left + if item.level is 'document' and item.terminator is 'begin' then 18 else 10
      y: (item) -> item.bbox.top - 5
      
  # entities
  entities = svg.selectAll('.entity')
    .data(lino.entities)
    
  enter_entities = entities.enter().append('g')
    .attr
      class: 'entity'
      fill: (e) -> class_color(e.class)
      
  enter_entities.append('title')
    .text((e) -> if e.original_class? then e.original_class else e.class)
    
  subentities = entities.selectAll('.subentity')
    .data((e) -> lino.content[lino.content.indexOf(e.tokens[0])..lino.content.indexOf(e.tokens[e.tokens.length-1])])
  
  subentities.enter().append('rect')
    .attr
     class: 'subentity'
      
  subentities
    .attr
      x: (se) -> se.bbox.left
      y: (se) -> se.bbox.top
      width: (se) -> se.bbox.width
      height: (se) -> se.bbox.height
      
  # DEBUG
  #debug = svg.selectAll('.debug')
  #  .data(lino.content)
  #  
  #debug.enter().append('text')
  #  .text((_, i) -> i)
  #  .attr
  #    class: 'debug'
  #    
  #debug
  #  .attr
  #    x: (item) -> item.bbox.left + item.bbox.width/2
  #    y: (item) -> item.bbox.top
  #    
  #debug_bbox = svg.selectAll('.debug_bbox')
  #  .data(lino.content)
  #  
  #debug_bbox.enter().append('rect')
  #  .attr
  #    class: 'debug_bbox'
  #    
  #debug_bbox
  #  .attr
  #    x: (item) -> item.bbox.left
  #    y: (item) -> item.bbox.top
  #    width: (item) -> item.bbox.width
  #    height: (item) -> item.bbox.height
  
