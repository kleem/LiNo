(function() {
  var class_color, pos_dx, pos_dy, splitter_height, splitter_offset, token_dy, token_gap, token_thickness;

  token_gap = 0;

  token_dy = 1;

  token_thickness = 1;

  pos_dx = 6.5;

  pos_dy = 8.5;

  splitter_height = 58;

  splitter_offset = 6;

  class_color = d3.scale.ordinal().domain(['person', 'organization', 'place', 'work', 'time', 'other']).range(['#E14E5F', '#A87621', '#43943E', '#AC5CC4', '#2986EC', '#7E7F7E']);

  window.lino_vis_default_new = function(lino, container, title_container) {
    title_container.classed('lino_header', true);
    title_container.text(lino.metadata.title);
    lino.entities.sort(function(a, b) {
      return b.tokens.length - a.tokens.length;
    });
    lino_vis_main_new(lino, container);
    lino_vis_default_redraw(container);
    return window.onresize = function() {
      return lino_vis_default_redraw(container);
    };
  };

  window.lino_vis_default_redraw = function(container) {
    var enter_entities, enter_poss, entities, html, lemmas, lino, poss, sentence_numbers, splitters, subentities, svg, tokens;
    lino_vis_main_redraw(container);
    lino = container.datum();
    svg = container.select('svg');
    html = container.select('div');
    tokens = svg.selectAll('.token').data(lino.content.filter(function(item) {
      return item.type === 'token';
    }));
    tokens.enter().append('rect').attr({
      "class": 'token'
    });
    tokens.attr({
      x: function(item) {
        return item.bbox.left + token_gap / 2;
      },
      y: function(item) {
        return item.bbox.bottom + token_dy;
      },
      width: function(item) {
        return item.bbox.width - token_gap;
      },
      height: token_thickness
    });
    lemmas = html.selectAll('.token ruby').selectAll('rt').data(function(token) {
      return [token];
    });
    lemmas.enter().append('rt').text(function(token) {
      return token.lemma;
    });
    poss = svg.selectAll('.pos').data(lino.content.filter(function(item) {
      return item.pos != null;
    }));
    enter_poss = poss.enter().append('use').attr({
      "class": 'pos'
    });
    enter_poss.append('title').text(function(item) {
      return item.pos;
    });
    poss.attr({
      'xlink:href': function(item) {
        return "#pos_" + item.pos;
      },
      transform: function(item) {
        var x, y;
        x = item.bbox.left + token_gap + pos_dx;
        y = item.bbox.bottom + token_dy + token_thickness + pos_dy;
        return "translate(" + x + " " + y + ") scale(1.5)";
      }
    });
    splitters = svg.selectAll('.splitter').data(lino.content.filter(function(item) {
      return item.type === 'splitter';
    }));
    splitters.enter().append('path').attr({
      "class": 'splitter'
    });
    splitters.attr({
      d: function(item) {
        switch (item.level) {
          case 'sentence':
            return "M" + (item.bbox.left + item.bbox.width / 2) + " " + (item.bbox.top + item.bbox.height / 2 - splitter_height / 2 + splitter_offset) + " l0 " + splitter_height;
          case 'document':
            switch (item.terminator) {
              case 'begin':
                return "M" + (item.bbox.left + 0.5) + " " + (item.bbox.top + item.bbox.height / 2 - splitter_height / 2 + splitter_offset) + " l0 " + splitter_height + " l2 0 l6 0 l-6 0 l0 " + (-splitter_height) + " l12 0 z";
              case 'end':
                return "M" + (item.bbox.right - 0.5) + " " + (item.bbox.top + item.bbox.height / 2 - splitter_height / 2 + splitter_offset) + " l0 " + splitter_height + " l-2 0 l-12 0 l12 0  l0 " + (-splitter_height) + " l-6 0 z";
            }
        }
      }
    });
    sentence_numbers = svg.selectAll('.sentence_number').data(lino.content.filter(function(item) {
      return item.type === 'splitter' && item.terminator !== 'end';
    }));
    sentence_numbers.enter().append('text').attr({
      "class": 'sentence_number'
    });
    sentence_numbers.text(function(splitter, i) {
      return i + 1;
    }).attr({
      x: function(item) {
        return item.bbox.left + (item.level === 'document' && item.terminator === 'begin' ? 18 : 10);
      },
      y: function(item) {
        return item.bbox.top - 5;
      }
    });
    entities = svg.selectAll('.entity').data(lino.entities);
    enter_entities = entities.enter().append('g').attr({
      "class": 'entity',
      fill: function(e) {
        return class_color(e["class"]);
      }
    });
    enter_entities.append('title').text(function(e) {
      if (e.original_class != null) {
        return e.original_class;
      } else {
        return e["class"];
      }
    });
    subentities = entities.selectAll('.subentity').data(function(e) {
      return lino.content.slice(lino.content.indexOf(e.tokens[0]), lino.content.indexOf(e.tokens[e.tokens.length - 1]) + 1 || 9e9);
    });
    subentities.enter().append('rect').attr({
      "class": 'subentity'
    });
    return subentities.attr({
      x: function(se) {
        return se.bbox.left;
      },
      y: function(se) {
        return se.bbox.top;
      },
      width: function(se) {
        return se.bbox.width;
      },
      height: function(se) {
        return se.bbox.height;
      }
    });
  };

}).call(this);
