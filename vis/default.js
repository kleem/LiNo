(function() {
  var pos_dx, pos_dy, splitter_height, splitter_offset, token_dy, token_gap, token_thickness;

  token_gap = 0;

  token_dy = 1;

  token_thickness = 1;

  pos_dx = 4;

  pos_dy = 6;

  splitter_height = 58;

  splitter_offset = 6;

  window.lino_vis_default_new = function(lino, container, title_container) {
    title_container.classed('lino_header', true);
    title_container.text(lino.metadata.title);
    lino_vis_main_new(lino, container);
    lino_vis_default_redraw(container);
    return window.onresize = function() {
      return lino_vis_default_redraw(container);
    };
  };

  window.lino_vis_default_redraw = function(container) {
    var html, lemmas, lino, poss, sentence_numbers, splitters, svg, tokens;
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
    poss.enter().append('use').attr({
      "class": 'pos'
    });
    poss.attr({
      'xlink:href': function(item) {
        return "#pos_" + item.pos;
      },
      x: function(item) {
        return item.bbox.left + token_gap + pos_dx;
      },
      y: function(item) {
        return item.bbox.bottom + token_dy + token_thickness + pos_dy;
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
    return sentence_numbers.text(function(splitter, i) {
      return i + 1;
    }).attr({
      x: function(item) {
        return item.bbox.left + (item.level === 'document' && item.terminator === 'begin' ? 18 : 10);
      },
      y: function(item) {
        return item.bbox.top - 5;
      }
    });
  };

}).call(this);
