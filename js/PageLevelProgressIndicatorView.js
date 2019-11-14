define([
  'core/js/adapt'
], function(Adapt) {

  var PageLevelProgressIndicatorView = Backbone.View.extend({

    initialize: function(options) {
      options = options || {};
      this.calculatePercentage = options.calculatePercentage || this.calculatePercentage;
      this.ariaLabel = options.ariaLabel || '';
      this.type = options.type || this.model.get('_type');
      this.addClasses();
      this.setUpEventListeners();
      this.render();
      this.refresh();
    },

    addClasses: function() {
      this.$el.addClass([
        'pagelevelprogress__indicator',
        'is-' + this.type
      ].join(' '));
    },

    checkAria: function() {
      if (!this.ariaLabel) {
        this.$el.attr('aria-hidden', true);
        return;
      }
      var data = this.model.toJSON();
      data.ariaLabel = this.ariaLabel;
      data.type = this.type;
      this.model.set('percentageComplete', percentage);
      this.$('.js-indicator-aria-label').html(Handlebars.compile(this.ariaLabel)(data));
    },

    setUpEventListeners: function() {
      this.listenTo(Adapt, 'remove', this.remove);
      this.listenTo(this.model, 'change:_isComplete', this.refresh);
      if (!this.collection) return;
      this.listenTo(this.collection, 'change:_isComplete', this.refresh);
    },

    refresh: function() {
      this.checkCompletion();
      this.checkAria();
      this.$('.js-indicator-bar').css({
        width: this.calculatePercentage() + '%'
      });
    },

    checkCompletion: function() {
      var percentage = this.calculatePercentage();
      this.model.set('percentageComplete', percentage);
      this.$el
          .toggleClass('is-complete', percentage === 100)
          .toggleClass('is-incomplete', percentage !== 100);
    },

    calculatePercentage: function() {
      return this.model.get('_isComplete') ? 100 : 0;
    },

    render: function() {
      var data = this.model.toJSON();
      data.ariaLabel = this.ariaLabel;
      data.type = this.type;
      var template = Handlebars.templates[this.constructor.template];
      this.$el.html(template(data));
    }

  }, {
    template: 'pageLevelProgressIndicator'
  });

  return PageLevelProgressIndicatorView;

});
