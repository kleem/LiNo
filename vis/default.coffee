# visualization parameters
token_gap = 0 # distance between token underlines
token_dy = 1 # distance between text and token underlines
token_thickness = 1 # thickness of token and polarity underlines

pos_dx = 4
pos_dy = 6

splitter_height = 58
splitter_offset = 6

window.lino_vis_default_new = (lino, container, title_container) ->
  # display the document title
  title_container.text lino.metadata.title
  
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
  
  poss.enter().append('use')
    .attr
      class: 'pos'
  
  poss
    .attr
      'xlink:href': (item) -> "#pos_#{item.pos}"
      x: (item) -> item.bbox.left + token_gap + pos_dx
      y: (item) -> item.bbox.bottom + token_dy + token_thickness + pos_dy
      
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
      