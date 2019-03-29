define([
  'core/js/adapt',
  './completionCalculations',
  './PageLevelProgressView',
  './PageLevelProgressIndicatorView'
], function(Adapt, completionCalculations, PageLevelProgressView, PageLevelProgressIndicatorView) {

  var PageLevelProgressNavigationView = Backbone.View.extend({

    tagName: 'button',

    className: 'base pagelevelprogress-navigation',

    events: {
      'click': 'onProgressClicked'
    },

    initialize: function() {
      _.bindAll(this, 'updateProgressBar');
      this.setUpEventListeners();
      this.render();
      this.addIndicator();
      this.deferredUpdate();
    },

    setUpEventListeners: function() {
      this.listenTo(Adapt, {
        'remove': this.remove,
        'router:location': this.updateProgressBar,
        'pageLevelProgress:update': this.refreshProgressBar
      });
    },

    render: function() {
      var template = Handlebars.templates['pageLevelProgressNavigation'];
      this.$el.html(template({}));
    },

    addIndicator: function() {
      this.indicatorView = new PageLevelProgressIndicatorView({
        model: this.model,
        collection: this.collection,
        calculatePercentage: this._getPageCompletionPercentage,
        ariaLabel: Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressIndicatorBar
      });
      this.$el.prepend(this.indicatorView.$el);
    },

    _getPageCompletionPercentage: function() {
      return completionCalculations.calculatePercentageComplete(this.model);
    },

    deferredUpdate: function() {
      _.defer(this.updateProgressBar);
    },

    updateProgressBar: function() {
      this.indicatorView.refresh();
    },

    refreshProgressBar: function() {
      this.collection.repopulate(enabledProgressItems);
      this.updateProgressBar();
    },

    onProgressClicked: function(event) {
      if (event && event.preventDefault) event.preventDefault();
      Adapt.drawer.triggerCustomView(new PageLevelProgressView({
        collection: this.collection
      }).$el, false);
    },

    remove: function() {
      Backbone.View.prototype.remove.call(this);
      this.collection.reset();
    }

  });

  return PageLevelProgressNavigationView;

});
