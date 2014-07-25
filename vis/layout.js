(function() {

  window.lino_vis_new = function(lino, selection) {
    selection.datum(lino);
    selection.style({
      'position': 'relative'
    }).attr({
      "class": 'lino'
    });
    selection.append('svg').style({
      'position': 'absolute'
    });
    selection.append('div').style({
      'position': 'relative',
      'pointer-events': 'none'
    });
    return selection;
  };

  window.lino_vis_redraw = function(selection) {
    var html, html_bbox, items, svg;
    html = selection.select('div');
    svg = selection.select('svg');
    items = html.selectAll('.item').data(function(lino) {
      return lino.content;
    });
    items.enter().append('span').attr({
      "class": function(item) {
        return "item " + item.type;
      }
    });
    items.filter(function(item) {
      return item.text != null;
    }).html(function(item) {
      if (item.type === 'token') {
        return item.text.replace(new RegExp(' ', 'g'), '&nbsp;').replace(new RegExp('-', 'g'), '&#8209;');
      }
      return item.text;
    });
    html_bbox = html.node().getBoundingClientRect();
    svg.attr({
      width: html_bbox.width,
      height: html_bbox.height
    });
    items.each(function(item) {
      var client_rect;
      client_rect = this.getBoundingClientRect();
      return item.bbox = {
        left: client_rect.left - html_bbox.left,
        right: client_rect.right - html_bbox.left,
        top: client_rect.top - html_bbox.top,
        bottom: client_rect.bottom - html_bbox.top,
        width: client_rect.width,
        height: client_rect.height
      };
    });
    return selection;
  };

}).call(this);
