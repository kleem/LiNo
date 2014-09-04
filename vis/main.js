(function() {

  window.lino_vis_main_new = function(lino, selection) {
    var defs, html, svg;
    selection.datum(lino);
    selection.style({
      'position': 'relative'
    }).attr({
      "class": 'lino'
    });
    svg = selection.append('svg').style({
      'position': 'absolute'
    });
    html = selection.append('div').style({
      'position': 'relative',
      'pointer-events': 'none'
    });
    defs = svg.append('defs');
    defs.html('<path id="pos_noun" d="m -3,-3 6,0 0,6 -6,0 z"/>\n<path id="pos_verb" d="M -3,-4 4,0 -3,4 z"/>\n<path id="pos_adjective" d="m -3,-3 0,6 6,0 0,-6 z m 2,2 2,0 0,2 -2,0 z"/>\n<path id="pos_adverb" d="M -3 -4 L -3 4 L 4 0 L -3 -4 z M -1.4375 -1.5 L 1.1875 0 L -1.4375 1.5 L -1.4375 -1.5 z"/>\n<path id="pos_pronoun" d="M -3 -3 L -3 -1 L -1 -1 L -1 -3 L -3 -3 z M 1 -3 L 1 -1 L 3 -1 L 3 -3 L 1 -3 z M -3 1 L -3 3 L -1 3 L -1 1 L -3 1 z M 1 1 L 1 3 L 3 3 L 3 1 L 1 1 z"/>\n<path id="pos_preposition" d="m -1,-6 0,5 2,0 2,0 0,-2 -2,0 0,-3 z"/>\n<path id="pos_determiner" d="m -1,-6 0,5 2,0 0,-5 z"/>\n<path id="pos_conjunction" d="m -1,-6 0,3 -2,0 0,2 2,0 0,2 2,0 0,-2 2,0 0,-2 -2,0 0,-3 z"/>\n<path id="pos_participle" d="M 0 -4.25 L -4.25 0 L 0 4.25 L 4.25 0 L 0 -4.25 z M 0 -1.40625 L 1.40625 0 L 0 1.40625 L -1.40625 0 L 0 -1.40625 z"/>\n<path id="pos_other" d="m -1,-6 0,2 2,0 0,-2 z"/>');
    return selection;
  };

  window.lino_vis_main_redraw = function(selection) {
    var entered_spans, html, html_bbox, items, svg;
    html = selection.select('div');
    svg = selection.select('svg');
    items = html.selectAll('.item').data(function(lino) {
      return lino.content;
    });
    entered_spans = items.enter().append('span').attr({
      "class": function(item) {
        return "item " + item.type;
      }
    });
    entered_spans.filter(function(item) {
      return item.type === 'token';
    }).append('ruby').append('rb');
    items.filter(function(item) {
      return item.type === 'token' && (item.text != null);
    }).selectAll('ruby > rb').html(function(item) {
      return item.text.replace(new RegExp(' ', 'g'), '&nbsp;').replace(new RegExp('-', 'g'), '&#8209;');
    });
    items.filter(function(item) {
      return item.type !== 'token' && (item.text != null);
    }).html(function(item) {
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
