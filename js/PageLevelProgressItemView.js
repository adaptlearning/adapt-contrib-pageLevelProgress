define([
  'core/js/adapt',
  './PageLevelProgressIndicatorView'
], function(Adapt, PageLevelProgressIndicatorView) {

  var PageLevelProgressItemView = Backbone.View.extend({

    className: function () {
      return [
        'pagelevelprogress__item drawer__item',
        this.model.get('_type') + '__indicator'
      ].join(' ');
    },

    attributes: {
      'role': 'listitem'
    },

    initialize: function() {
      this.listenTo(Adapt, 'remove', this.remove);
      this.render();
      this.addIndicator();
    },

    render: function() {
      var data = this.model.toJSON();
      var template = Handlebars.templates[this.constructor.template];
      this.$el.html(template(data));
    },

    addIndicator: function() {
      if (this.model.get('_isOptional')) return;
      var item = new PageLevelProgressIndicatorView({
        model: this.model
      });
      this.$('.js-indicator').append(item.$el);
    }

  }, {
    template: 'pageLevelProgressItem'
  });

  return PageLevelProgressItemView;

});
