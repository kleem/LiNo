# create a new lino container for the given lino data and d3 selection
window.lino_vis_new = (lino, selection) ->
    selection.datum(lino)
    
    selection
        .style
            'position': 'relative'
        .attr
            class: 'lino'
            
    selection.append('svg')
        .style
            'position': 'absolute'
            
    selection.append('div')
        .style
            'position': 'absolute'
            'pointer-events': 'none' # this is needed to have svg events work
    
    return selection
    
    
# redraw a lino container
window.lino_vis_redraw = (selection) ->
    html = selection.select('div')
    svg = selection.select('svg')
    
    # represent items as spans
    items = html.selectAll('.item')
        .data((lino) -> lino.content)
        
    items.enter().append('span')
        .attr
            class: (item) -> "item #{item.type}"
        
    items.filter((item) -> item.text?)
        .html((item) -> item.text)
    
    
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
    
